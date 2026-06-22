import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseConfigured } from '../firebase'
import logo from '../components/logo.png'

const initialData = {
  studentName: '',
  fatherName: '',
  registrationNumber: '',
  studentClass: '',
  phoneNumber: '',
}

const fieldMeta = [
  {
    name: 'studentName',
    label: "Student's Name",
    type: 'text',
    placeholder: 'e.g. Ali Abbas',
    autoComplete: 'name',
  },
  {
    name: 'fatherName',
    label: "Mother's Name",
    type: 'text',
    placeholder: 'e.g. Ayesha ',
    autoComplete: 'off',
  },
  {
    name: 'registrationNumber',
    label: 'Admission Number',
    type: 'text',
    placeholder: 'e.g-0143',
    autoComplete: 'off',
    mono: true,
  },
  {
    name: 'studentClass',
    label: 'Class/Section',
    type: 'text',
    placeholder: 'e.g. 9th - Section A',
    autoComplete: 'off',
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'e.g. 03001234567',
    autoComplete: 'tel',
  },
]

function validateField(name, value) {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'This field is required.'
  }

  if (name === 'phoneNumber') {
    const phonePattern = /^[0-9+\s-]{7,15}$/
    if (!phonePattern.test(trimmed)) {
      return 'Enter a valid phone number (digits only, 7-15 characters).'
    }
  }

  if (name === 'registrationNumber') {
    const regPattern = /^[A-Za-z0-9-]{3,20}$/
    if (!regPattern.test(trimmed)) {
      return 'Use 3-20 letters, numbers, or hyphens only.'
    }
  }

  if ((name === 'studentName' || name === 'fatherName') && trimmed.length < 2) {
    return 'Enter at least 2 characters.'
  }

  return ''
}

function validateAll(data) {
  const errors = {}
  fieldMeta.forEach(({ name }) => {
    const message = validateField(name, data[name])
    if (message) errors[name] = message
  })
  return errors
}

export default function StudentForm() {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const allErrors = validateAll(formData)
    setErrors(allErrors)
    setTouched(
      fieldMeta.reduce((acc, { name }) => ({ ...acc, [name]: true }), {})
    )

    if (Object.keys(allErrors).length > 0) return

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        studentName: formData.studentName.trim(),
        fatherName: formData.fatherName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        studentClass: formData.studentClass.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      setFormData(initialData)
      setTouched({})
      setErrors({})
    } catch (err) {
      console.error('Error saving student record:', err)
      setSubmitError('Could not save the record. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegisterAnother = () => {
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-paper px-4 py-10 sm:py-16 font-body text-ink">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-48 w-auto" />
        </div>
        <p className="font-mono text-xs tracking-[0.2em] text-accentDark uppercase">
          Registration
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">
          Parental Workshop
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate">
          Fill in the details below. To attend the workshop, Mother should be registered by filling the following information.
        </p>
 <div className="mt-4 rounded-2xl bg-white text-black p-6 shadow-sm">
            <h3 className='font-bold'>Event Details:</h3>
            <p className="text-sm text-black/80 mt-2">
              Date:July 3,2026 (Friday)
              <br />
              Time: 10:00 AM - 12:30 PM
              <br />
              Venue: Conference Room  KPS Rachna Town
              <br />
              Topic: Role of  Mother
            </p>
          </div>
        {!firebaseConfigured && (
          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accentDark">
            <strong className="font-semibold">Setup needed:</strong> add your
            Firebase project keys to the <code className="font-mono">.env</code>{' '}
            file in the project root, then restart{' '}
            <code className="font-mono">npm run dev</code>. See README.md for
            the 2-minute walkthrough.
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_auto_300px] gap-0 md:gap-8 items-start">
          {/* Form panel */}
          <div className="bg-white rounded-2xl border border-line shadow-sm p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accentDark"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">
                  Thank You 
                </h2>
                <p className="mt-1 text-sm text-slate">
                  The student {formData.firstName} {formData.lastName} has been registered successfully.
                </p>
                <button
                  type="button"
                  onClick={handleRegisterAnother}
                  className="mt-6 rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
                >
                  Register another student
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  {fieldMeta.map(({ name, label, type, placeholder, autoComplete, mono }) => (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className="block text-sm font-medium text-ink mb-1.5"
                      >
                        {label} <span className="text-accentDark">*</span>
                      </label>
                      <input
                        id={name}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        aria-required="true"
                        aria-invalid={Boolean(touched[name] && errors[name])}
                        aria-describedby={`${name}-error`}
                        className={`w-full rounded-lg border bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 outline-none transition-colors focus:bg-white focus:ring-2 ${
                          mono ? 'font-mono' : ''
                        } ${
                          touched[name] && errors[name]
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-line focus:border-accent focus:ring-accent/20'
                        }`}
                      />
                      <p
                        id={`${name}-error`}
                        className={`mt-1 text-xs text-red-600 transition-opacity ${
                          touched[name] && errors[name] ? 'opacity-100' : 'opacity-0 h-0'
                        }`}
                      >
                        {touched[name] && errors[name] ? errors[name] : '\u00A0'}
                      </p>
                    </div>
                  ))}
                </div>

                {submitError && (
                  <p className="mt-2 text-sm text-red-600">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accentDark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving…' : 'Submit Registration'}
                </button>
              </form>
            )}
          </div>

          {/* Perforated divider (desktop only) */}
          <div className="hidden md:block relative h-full">
            <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-line" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-paper" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-paper" />
          </div>

          {/* Live ID card preview */}
          <div>
          <div className="mt-8 md:mt-0 rounded-2xl bg-ink text-white p-6 shadow-sm">
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
              Student ID Preview
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold truncate">
              {formData.studentName || 'Student name'}
            </h3>
            <p className="text-sm text-white/60 truncate">
              {formData.fatherName ? `S/O ${formData.fatherName}` : "Father's name"}
            </p>

            <div className="mt-5 border-t border-white/15 pt-4 space-y-3">
              <div>
                <p className="text-[10px] tracking-wide text-white/40 uppercase">
                  Registration No.
                </p>
                <p className="font-mono text-sm text-accent">
                  {formData.registrationNumber || '—'}
                </p>
              </div>
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-wide text-white/40 uppercase">Class</p>
                  <p className="text-sm">{formData.studentClass || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-wide text-white/40 uppercase">Phone</p>
                  <p className="text-sm">{formData.phoneNumber || '—'}</p>
                </div>
              </div>
            </div>
          </div>
         
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-black/50 mt-4">
        {/* Powered by Raheel Abbas */}
      </div>
    </div>
  )
}
