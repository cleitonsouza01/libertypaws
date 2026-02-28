'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Mail, Phone, MessageCircle, Clock, ChevronDown, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { clarityEvent } from '@/lib/clarity'

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

export default function ContactPageClient() {
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

      clarityEvent('contact_form_submit')
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      clarityEvent('contact_form_error')
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
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="bg-secondary py-16 text-secondary-content">
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
            className="mx-auto max-w-2xl text-lg text-secondary-content/80"
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
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      {t('form.name')} *
                    </legend>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      className={cn(
                        'input w-full',
                        errors.name && 'input-error'
                      )}
                    />
                    {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
                  </fieldset>

                  {/* Email */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      {t('form.email')} *
                    </legend>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('form.emailPlaceholder')}
                      className={cn(
                        'input w-full',
                        errors.email && 'input-error'
                      )}
                    />
                    {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                  </fieldset>

                  {/* Phone */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      {t('form.phone')}
                    </legend>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('form.phonePlaceholder')}
                      className="input w-full"
                    />
                  </fieldset>

                  {/* Subject */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      {t('form.subject')} *
                    </legend>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={cn(
                        'select w-full',
                        errors.subject && 'select-error'
                      )}
                    >
                      <option value="">{t('form.subjectPlaceholder')}</option>
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-error">{errors.subject}</p>}
                  </fieldset>

                  {/* Message */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      {t('form.message')} *
                    </legend>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      rows={5}
                      className={cn(
                        'textarea w-full',
                        errors.message && 'textarea-error'
                      )}
                    />
                    {errors.message && <p className="mt-1 text-sm text-error">{errors.message}</p>}
                  </fieldset>

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
                      role="alert"
                      className="alert alert-success text-center"
                    >
                      {t('form.success')}
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="alert alert-error text-center"
                    >
                      {t('form.error')}
                    </motion.div>
                  )}
                </form>
                </div>
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
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-secondary">{t('info.title')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary">{t('info.email')}</h3>
                      <p className="text-base-content/60">support@libertypaws.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary">{t('info.phone')}</h3>
                      <a href="tel:+15618846581" className="link link-hover text-base-content/60">
                        {t('info.phoneNumber')}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/10">
                      <MessageCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary">{t('info.whatsapp')}</h3>
                      <a
                        href="https://wa.me/15618846581"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover text-base-content/60"
                      >
                        {t('info.whatsappText')}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary">{t('info.liveChat')}</h3>
                      <p className="text-base-content/60">{t('info.liveChatHours')}</p>
                      <p className="text-xs text-base-content/40 mt-1">{t('info.response')}</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-secondary">{t('faq.title')}</h2>
                <div className="space-y-4">
                  {faqItems.map((item) => (
                    <div key={item.id} className="border-b border-base-300 pb-4 last:border-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="font-medium text-base-content">{item.question}</span>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 shrink-0 text-base-content/40 transition-transform',
                            openFaq === item.id && 'rotate-180'
                          )}
                        />
                      </button>
                      {openFaq === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 text-base-content/60"
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
