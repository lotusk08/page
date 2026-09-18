import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

// Set TLDRAW_LICENSE_KEY at build time to license this deployment. Without it
// the SDK renders its production watermark; removing that watermark without a
// key breaks the tldraw license.
const licenseKey = process.env.TLDRAW_LICENSE_KEY || undefined

export function Canvas() {
	return (
		<div className="tldraw__editor">
			<Tldraw licenseKey={licenseKey} />
		</div>
	)
}
