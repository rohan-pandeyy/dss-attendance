'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function AttendanceForm() {
  const [name, setName] = React.useState('')
  const [github, setGithub] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
  const githubRegex = new RegExp('^https://github\\.com/[a-zA-Z0-9_-]+$');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Name is required');
      return
    }

    const trimmedGithub = github.trim();
    if (trimmedGithub && !githubRegex.test(trimmedGithub)) {
      setError('Invalid GitHub profile URL. It should be in the format https://github.com/<username>');
      return;
    }

    setError('');
    setSubmitting(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, github: trimmedGithub }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSuccess(true)
      setName('')
      setGithub('')
    } catch (err) {
      console.error(err)
      setError('Failed to submit attendance');
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-3'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='full-name' className='sr-only'>
          Full name
        </Label>
        <Input
          id='full-name'
          name='full-name'
          placeholder='Enter your full name'
          value={name}
          onChange={(e) => setName(toTitleCase(e.target.value))}
          className='h-12 rounded-lg text-base md:h-12'
          aria-required='true'
          autoComplete='name'
        />
        {/* <Label htmlFor='github-url' className='sr-only'>
          GitHub URL
        </Label>
        <Input
          id='github-url'
          name='github-url'
          placeholder='GitHub Profile URL'
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className='h-12 rounded-lg text-base md:h-12'
          autoComplete='url'
        /> */}
      </div>
      {error && (
        <p role="alert" className="mt-1 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <Button
        type='submit'
        disabled={submitting}
        className='h-12 w-full rounded-lg text-base transition-transform hover:-translate-y-0.5 active:translate-y-0 md:h-12'
      >
        {submitting ? 'Submitting…' : 'Submit'}
      </Button>

      {success && (
        <p role="status" className="mt-1 text-center text-sm text-green-600 dark:text-green-400">
          Thank you, your entry has been recorded!
        </p>
      )}
    </form>
  )
}
