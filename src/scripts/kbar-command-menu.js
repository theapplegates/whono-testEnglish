import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches
} from 'https://esm.sh/kbar@0.1.0-beta.48?external=react,react-dom';

const h = React.createElement;
const TOGGLE_EVENT = 'whono:kbar-toggle';

const parseActions = (root) => {
  try {
	const raw = JSON.parse(root.dataset.kbarActions || '[]');
	if (!Array.isArray(raw)) return [];

	return raw
	  .filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string')
	  .map((item) => {
		const action = {
		  id: item.id,
		  name: item.name,
		  keywords: typeof item.keywords === 'string' ? item.keywords : '',
		  section: typeof item.section === 'string' ? item.section : 'Navigation'
		};

		if (Array.isArray(item.shortcut)) {
		  action.shortcut = item.shortcut.filter((key) => typeof key === 'string');
		}

		if (typeof item.href === 'string' && item.href) {
		  action.perform = () => window.location.assign(item.href);
		} else if (typeof item.targetId === 'string' && item.targetId) {
		  action.perform = () => document.getElementById(item.targetId)?.click();
		}

		return action;
	  });
  } catch (error) {
	console.error('[kbar] Unable to read command actions.', error);
	return [];
  }
};

function ToggleBridge() {
  const { query } = useKBar();

  useEffect(() => {
	const handleToggle = () => query.toggle();
	window.addEventListener(TOGGLE_EVENT, handleToggle);
	return () => window.removeEventListener(TOGGLE_EVENT, handleToggle);
  }, [query]);

  return null;
}

function SearchResults() {
  const { results } = useMatches();

  if (results.length === 0) {
	return h('div', { className: 'whono-kbar__empty' }, 'No matching pages or actions.');
  }

  return h(KBarResults, {
	items: results,
	maxHeight: 420,
	onRender: ({ item, active }) => {
	  if (typeof item === 'string') {
		return h('div', { className: 'whono-kbar__section' }, item);
	  }

	  return h(
		'div',
		{
		  className: `whono-kbar__result${active ? ' is-active' : ''}`,
		  'aria-selected': active
		},
		h('span', { className: 'whono-kbar__result-name' }, item.name),
		item.shortcut?.length
		  ? h(
			  'span',
			  { className: 'whono-kbar__shortcuts', 'aria-hidden': 'true' },
			  item.shortcut.map((key) => h('kbd', { key }, key))
			)
		  : null
	  );
	}
  });
}

function CommandMenu({ actions }) {
  return h(
	KBarProvider,
	{ actions },
	h(ToggleBridge),
	h(
	  KBarPortal,
	  null,
	  h(
		KBarPositioner,
		{ className: 'whono-kbar__positioner' },
		h(
		  KBarAnimator,
		  { className: 'whono-kbar__animator' },
		  h(
			'div',
			{ className: 'whono-kbar__search-row' },
			h(
			  'svg',
			  {
				className: 'whono-kbar__search-icon',
				viewBox: '0 0 24 24',
				fill: 'none',
				stroke: 'currentColor',
				strokeWidth: 2,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				'aria-hidden': 'true'
			  },
			  h('circle', { cx: 11, cy: 11, r: 8 }),
			  h('path', { d: 'm21 21-4.3-4.3' })
			),
			h(KBarSearch, {
			  className: 'whono-kbar__search',
			  placeholder: 'Search pages and actions…',
			  'aria-label': 'Command menu search'
			}),
			h('kbd', { className: 'whono-kbar__escape', 'aria-hidden': 'true' }, 'Esc')
		  ),
		  h(SearchResults)
		)
	  )
	)
  );
}

const mountCommandMenu = () => {
  const rootElement = document.querySelector('[data-kbar-root]');
  const toggleButton = document.querySelector('[data-kbar-toggle]');
  if (!(rootElement instanceof HTMLElement) || !(toggleButton instanceof HTMLButtonElement)) return;

  const actions = parseActions(rootElement);
  const root = createRoot(rootElement);
  root.render(h(CommandMenu, { actions }));

  toggleButton.addEventListener('click', () => {
	window.dispatchEvent(new CustomEvent(TOGGLE_EVENT));
  });
};

try {
  mountCommandMenu();
} catch (error) {
  console.error('[kbar] Command menu failed to start.', error);
  const toggleButton = document.querySelector('[data-kbar-toggle]');
  if (toggleButton instanceof HTMLButtonElement) {
	toggleButton.disabled = true;
	toggleButton.dataset.tooltip = 'Command menu unavailable';
  }
}
