import { useState } from 'react'
import { siWhatsapp, siTelegram, siFacebook, siX, siImessage, siGmail } from 'simple-icons'
import { PageTitle } from '../components/ui'
import { APP_NAME } from '../components/Layout'

// Share the site with friends: the phone's own share sheet where it exists, plus direct buttons for common apps.
export default function Invite() {
  const url = window.location.origin
  const text = `Check which Ghanaian school programs you qualify for, and find scholarships, on ${APP_NAME}.`
  const [copied, setCopied] = useState(false)
  const [note, setNote] = useState('')
  const e = encodeURIComponent
  const canShare = typeof navigator !== 'undefined' && !!navigator.share

  const targets = [
    { icon: siWhatsapp, label: 'WhatsApp', href: `https://wa.me/?text=${e(`${text} ${url}`)}` },
    { icon: siTelegram, label: 'Telegram', href: `https://t.me/share/url?url=${e(url)}&text=${e(text)}` },
    { icon: siFacebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { icon: siX, label: 'X', href: `https://twitter.com/intent/tweet?text=${e(text)}&url=${e(url)}` },
    { icon: siImessage, label: 'Text message', href: `sms:?&body=${e(`${text} ${url}`)}` },
    { icon: siGmail, label: 'Email', href: `mailto:?subject=${e(`Try ${APP_NAME}`)}&body=${e(`${text}\n\n${url}`)}` },
  ]

  const share = async () => {
    setNote('')
    try { await navigator.share({ title: APP_NAME, text, url }) } catch (err) { if (err?.name !== 'AbortError') setNote('Sharing did not open. Use one of the buttons below.') }
  }
  const copy = async () => {
    setNote('')
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch { setNote(`Could not copy. Select and copy this link: ${url}`) }
  }

  return (
    <div className="max-w-xl space-y-6">
      <PageTitle title="Invite friends" sub="Know someone finishing senior high school? Send them the link." />
      <div className="card space-y-4">
        <p className="text-sm text-neutral-600">{text}</p>
        <p className="font-semibold break-all">{url}</p>
        {canShare && <button className="btn btn-orange w-full" onClick={share}>Share</button>}
        <div className="grid grid-cols-2 gap-3">
          {targets.map((t) => (
            <a key={t.label} className="btn btn-outline !justify-start gap-3" href={t.href} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="shrink-0"><path d={t.icon.path} fill={t.label === 'X' ? '#000' : `#${t.icon.hex}`} /></svg>
              <span>{t.label}</span>
            </a>
          ))}
        </div>
        <button className="btn btn-green w-full" onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
        {note && <p role="status" className="text-sm text-neutral-700">{note}</p>}
      </div>
    </div>
  )
}
