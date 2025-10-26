import { useState } from 'react';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from './Loader';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const extension = file.type.split('/')[1];

    // Check if user is authenticated
    if (!auth.currentUser) {
      console.error('User not authenticated');
      alert('Please sign in to upload images');
      return;
    }

    // Makes reference to the storage bucket location
    const fileName = `${Date.now()}.${extension}`;
    const storagePath = `uploads/${auth.currentUser.uid}/${fileName}`;
    
    const storageRef = ref(storage, storagePath);
    setUploading(true);

    // Try simple upload first (fallback for CORS issues)
    try {
      const snapshot = await uploadBytes(storageRef, file);
      
      const url = await getDownloadURL(snapshot.ref);
      setDownloadURL(url);
      setUploading(false);
      return;
    } catch (simpleError) {
      console.warn('⚠️ Simple upload failed, trying resumable upload...', simpleError);
    }

    // Starts the resumable upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen to updates to upload task
    uploadTask.on('state_changed', 
      (snapshot) => {
        const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        setProgress(Number(pct));
      },
      (error) => {
        console.error('💥 Upload error details:', error);
        console.error('🔍 Error code:', error.code);
        console.error('📝 Error message:', error.message);
        console.error('🏗️ Storage bucket:', storage.app.options.storageBucket);
        console.error('📍 Full path:', storageRef.fullPath);
        console.error('👤 User ID:', auth.currentUser?.uid);
        
        // Check if it's a network error
        if (error.code === 'storage/unknown' || error.message.includes('net::ERR_FAILED')) {
          console.error('🌐 This appears to be a network/CORS error');
          alert('Upload failed due to network error. Please check your Firebase Storage CORS configuration.');
        } else {
          alert(`Upload failed: ${error.message}`);
        }
        setUploading(false);
      },
      async () => {
        // Upload completed successfully, get the download URL
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadURL(url);
          setUploading(false);
        } catch (error) {
          console.error('💥 Error getting download URL:', error);
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Image
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg,image/jpg" />
          </label>
        </>
      )}

      {downloadURL && (
        <div>
          <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
          <button 
            type="button"
            className="btn"
            onClick={() => {
              navigator.clipboard.writeText(`![alt](${downloadURL})`);
              alert('Image markdown copied! Paste it into your content.');
            }}
            style={{ marginLeft: '10px' }}
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  );
}