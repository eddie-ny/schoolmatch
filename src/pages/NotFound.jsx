import { Link } from 'react-router-dom'
import { PageTitle } from '../components/ui'
import { useNoindex } from '../lib/seo'

export default function NotFound() {
  useNoindex()
  return (
    <div className="max-w-md space-y-4">
      <PageTitle title="Page not found" sub="That page does not exist or has moved." />
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn btn-orange">Go home</Link>
        <Link to="/schools" className="btn btn-outline">Find a school</Link>
      </div>
    </div>
  )
}
