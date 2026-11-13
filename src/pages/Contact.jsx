import { PageTitle } from '../components/ui'

const PHONE = '+233205658716'
const EMAIL = 'info@inbox.jambaconsult.com'

export default function Contact() {
  return (
    <div className="max-w-xl">
      <PageTitle title="Contact us" sub="Questions about the site, your account or a payment? Reach us here." />
      <div className="card space-y-4">
        <div>
          <p className="text-sm text-neutral-600">Phone or WhatsApp</p>
          <a href={`tel:${PHONE}`} className="text-xl font-bold underline">+233 20 565 8716</a>
        </div>
        <div>
          <p className="text-sm text-neutral-600">Email</p>
          <a href={`mailto:${EMAIL}`} className="text-xl font-bold underline break-all">{EMAIL}</a>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href={`tel:${PHONE}`} className="btn btn-orange">Call us</a>
          <a href={`mailto:${EMAIL}`} className="btn btn-outline">Send an email</a>
        </div>
        <p className="text-sm text-neutral-600">To report a problem or leave feedback, use the <a href="/complaints" className="underline">complaints box</a>.</p>
      </div>
    </div>
  )
}
