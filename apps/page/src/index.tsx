import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
	DefaultErrorFallback,
	ErrorBoundary,
	setDefaultEditorAssetUrls,
	setDefaultUiAssetUrls,
} from 'tldraw'
import { Canvas } from './Canvas'
import { ExamplePage } from './ExamplePage'
import { examples } from './examples'
import { ExampleWrapper } from './ExampleWrapper'

const ENABLE_STRICT_MODE = false

// we use secret internal `setDefaultAssetUrls` functions to set these at the
// top-level so assets don't need to be passed down in every single example.
const assetUrls = getAssetUrlsByMetaUrl()
setDefaultEditorAssetUrls(assetUrls)
setDefaultUiAssetUrls(assetUrls)
const gettingStartedExamples = examples.find((e) => e.id === 'Getting started')
if (!gettingStartedExamples) throw new Error('Could not find getting started examples')
const basicExample = gettingStartedExamples.value[0]
if (!basicExample) throw new Error('Could not find initial example')

const router = createBrowserRouter([
	{
		path: '*',
		lazy: async () => ({ element: <div>404</div> }),
	},
	{
		path: '/',
		lazy: async () => ({ element: <Canvas /> }),
	},
	{
		path: 'examples',
		lazy: async () => {
			const Component = await basicExample.loadComponent()
			return {
				element: (
					<NoIndex>
						<ExamplePage example={basicExample}>
							<ExampleWrapper example={basicExample} component={Component} />
						</ExamplePage>
					</NoIndex>
				),
			}
		},
	},
	...examples.flatMap((exampleArray) =>
		exampleArray.value.flatMap((example) => [
			{
				path: example.path,
				lazy: async () => {
					const Component = await example.loadComponent()
					return {
						element: (
							<NoIndex>
								<ExamplePage example={example}>
									<ExampleWrapper example={example} component={Component} />
								</ExamplePage>
							</NoIndex>
						),
					}
				},
			},
			{
				path: `${example.path}/full`,
				lazy: async () => {
					const Component = await example.loadComponent()
					return {
						element: (
							<NoIndex>
								<ExampleWrapper example={example} component={Component} />
							</NoIndex>
						),
					}
				},
			},
		])
	),
])

function NoIndex({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Helmet>
				<meta name="robots" content="noindex, noimageindex, nofollow" />
			</Helmet>
			{children}
		</>
	)
}

function mount() {
	const rootElement = document.getElementById('root')
	if (!rootElement) throw new Error('Missing #root element')
	const root = createRoot(rootElement)
	const main = (
		<ErrorBoundary
			fallback={(error) => <DefaultErrorFallback error={error} />}
			onError={(error) => console.error(error)}
		>
			<HelmetProvider>
				<RootMeta />
				<RouterProvider router={router} />
			</HelmetProvider>
		</ErrorBoundary>
	)
	root.render(ENABLE_STRICT_MODE ? <StrictMode>{main}</StrictMode> : main)
}

// Waiting on DOMContentLoaded unconditionally loses the race whenever this
// module runs after the document already parsed: the listener never fires and
// the page stays blank with nothing in the console.
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mount)
} else {
	mount()
}

function RootMeta() {
	return (
		<Helmet>
			<title>page.stevehoang.com</title>
			{/* Unlisted while unlicensed: the tldraw license does not permit using the
			    SDK in a production environment without a key. Drop this, and
			    public/robots.txt, once TLDRAW_LICENSE_KEY is set. */}
			<meta name="robots" content="noindex, nofollow" />
			<meta
				name="keywords"
				content="tldraw, whiteboard, react, collaborative whiteboard, online drawing, infinite canvas, library"
			/>
			<meta name="description" content="An infinite canvas playground built with the tldraw SDK." />
		</Helmet>
	)
}
