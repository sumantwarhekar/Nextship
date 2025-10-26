"use client";

import styles from '../Admin.module.css';
import AuthCheck from '../../../../components/AuthCheck';
import { firestore, auth } from '../../../../lib/firebase';

import { useState, useContext, use } from 'react';
import { UserContext } from '../../../../lib/context';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUploader from '../../../../components/ImageUploader';

export default function AdminPostEdit({ params }) {
  return (
    <AuthCheck>
        <PostManager params={params} />
    </AuthCheck>
  );
}

function PostManager({ params }) {
  const [preview, setPreview] = useState(false);
  const { username } = useContext(UserContext);

  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const uid = auth.currentUser?.uid;
  
  // Always call hooks at the top level
  const postRef = (uid && slug) ? doc(firestore, `users/${uid}/posts/${slug}`) : null;
  const [post, loading, error] = useDocumentData(postRef);
  
  if (!uid || !slug) {
    return <div>Loading...</div>;
  }

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <main className={styles.container}>
      <section>
        <h1>{post.title}</h1>
        <p>ID: {post.slug}</p>

        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
      </section>

      <aside>
        <h3>Tools</h3>
        <button onClick={() => setPreview(!preview)}>
          {preview ? 'Edit' : 'Preview'}
        </button>
        <Link href={`/${username}/${slug}`}>
          <button className="btn-blue">Live view</button>
        </Link>
      </aside>
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState, formState: { errors } } = useForm({ defaultValues, mode: 'onChange' });

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea 
          name="content" 
          className={styles.textarea}
          placeholder="Write your post content here... Use Markdown for formatting!"
          {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required'}
          })}
        ></textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset className={styles.fieldset}>
          <div className={styles.checkbox}>
            <input name="published" type="checkbox" {...register('published')} />
            <label>Published</label>
          </div>
        </fieldset>

        <button type="submit" className={`btn-green ${styles.smallButton}`} disabled={!formState.isValid || !formState.isDirty}>
          Save Changes
        </button>
      </div>
    </form>
  );
}