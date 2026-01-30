'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Mail, MessageSquare, Clock, ChevronDown, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const t = useTranslations('contact')
  const tValidation = useTranslations('validation')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const subjectOptions = [
    { value: 'general', label: t('form.subjectOptions.general') },
    { value: 'product', label: t('form.subjectOptions.product') },
    { value: 'order', label: t('form.subjectOptions.order') },
    { value: 'other', label: t('form.subjectOptions.other') },
  ]

  const faqItems = [
    { id: 'q1', question: t('faq.questions.q1.question'), answer: t('faq.questions.q1.answer') },
    { id: 'q2', question: t('faq.questions.q2.question'), answer: t('faq.questions.q2.answer') },
    { id: 'q3', question: t('faq.questions.q3.question'), answer: t('faq.questions.q3.answer') },
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = tValidation('required')
    }

    if (!formData.email.trim()) {
      newErrors.email = tValidation('required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = tValidation('email')
    }

    if (!formData.subject) {
      newErrors.subject = tValidation('required')
    }

    if (!formData.message.trim()) {
      newErrors.message = tValidation('required')
    } else if (formData.message.trim().length < 10) {
      newErrors.message = tValidation('minLength', { min: 10 })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // TODO: Replace with actual Supabase integration
      // const { error } = await supabase.from('contacts').insert([formData])
      // if (error) throw error

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold md:text-5xl"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-primary-100"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      className={cn(
                        'w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      )}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('form.emailPlaceholder')}
                      className={cn(
                        'w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      )}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('form.phonePlaceholder')}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('form.subject')} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={cn(
                        'w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      )}
                    >
                      <option value="">{t('form.subjectPlaceholder')}</option>
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      rows={5}
                      className={cn(
                        'w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      )}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t('form.submit')}
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-green-100 p-4 text-center text-green-700"
                    >
                      {t('form.success')}
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-red-100 p-4 text-center text-red-700"
                    >
                      {t('form.error')}
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Contact Info & FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Contact Info */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('info.title')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('info.email')}</h3>
                      <p className="text-gray-600">support@libertypaws.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <MessageSquare className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Live Chat</h3>
                      <p className="text-gray-600">Available 9am - 5pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Response Time</h3>
                      <p className="text-gray-600">{t('info.response')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('faq.title')}</h2>
                <div className="space-y-4">
                  {faqItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="font-medium text-gray-900">{item.question}</span>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 shrink-0 text-gray-500 transition-transform',
                            openFaq === item.id && 'rotate-180'
                          )}
                        />
                      </button>
                      {openFaq === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 text-gray-600"
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
