import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import clsx from 'clsx'
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle,
} from 'react-icons/fa'
import { toast } from '../../features/ui/uiSlice'

const CONTACT_INFO = [
  {
    icon: <FaEnvelope />,
    title: 'Email',
    lines: ['support@servicesprint.in', 'We reply within 24 hours'],
  },
  {
    icon: <FaPhoneAlt />,
    title: 'Phone',
    lines: ['1800-123-456 (Toll Free)', 'Mon – Sat, 9am – 8pm'],
  },
  {
    icon: <FaMapMarkerAlt />,
    title: 'Office',
    lines: ['2nd Floor, Service Tower,', 'Connaught Place, Delhi'],
  },
  {
    icon: <FaClock />,
    title: 'Hours',
    lines: ['26/7 support line', 'Services bookable on demand'],
  },
]

const contactSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    phone: z.string().trim().optional(),
    subject: z.string().trim().min(3, 'Subject must be at least 3 characters.'),
    message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
  })
  .superRefine((data, ctx) => {
    if (data.phone && !/^[+\d\s-]{10,15}$/.test(data.phone)) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Enter a valid phone number.' })
    }
  })

const ContactPage = () => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  })

  const onSubmit = () => {
    toast(dispatch, "Thanks for reaching out! We'll get back to you shortly (demo — no message is really sent).", 'success')
    reset()
  }

  const inputClass = (name) => clsx('form-control', errors[name] && 'is-invalid')

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Contact us</h1>
        <p className="text-muted mb-0" style={{ maxWidth: 560, margin: '0 auto' }}>
          Questions about a booking or want to become a professional? Send us a message — we'd love to help.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="row g-3">
            {CONTACT_INFO.map((c) => (
              <div className="col-12 col-md-6 col-lg-12" key={c.title}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <div className="card-body d-flex align-items-center gap-3 p-3">
                    <span className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle flex-shrink-0" style={{ width: 46, height: 46 }}>
                      {c.icon}
                    </span>
                    <div>
                      <h6 className="fw-bold mb-1">{c.title}</h6>
                      {c.lines.map((l) => (
                        <div key={l} className="text-muted small">{l}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-1">Send us a message</h5>
              <p className="text-muted small mb-4">Fill in the form and our team will get back to you.</p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Full name <span className="text-danger">*</span></label>
                    <input className={inputClass('name')} placeholder="e.g. Priya Sharma" {...register('name')} />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input className={inputClass('email')} placeholder="you@example.com" {...register('email')} />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Phone</label>
                    <input className={inputClass('phone')} placeholder="+91 98xxx xxxxx" {...register('phone')} />
                    {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Subject <span className="text-danger">*</span></label>
                    <input className={inputClass('subject')} placeholder="e.g. Booking enquiry" {...register('subject')} />
                    {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message <span className="text-danger">*</span></label>
                    <textarea
                      className={inputClass('message')}
                      rows="5"
                      placeholder="How can we help you?"
                      {...register('message')}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mt-4">
                  <button type="submit" className="btn btn-primary rounded-pill px-4">
                    <FaPaperPlane className="me-1" size={12} /> Send message
                  </button>
                  <span className="small text-muted d-inline-flex align-items-center gap-1">
                    <FaCheckCircle className="text-success" /> No spam, we promise.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage