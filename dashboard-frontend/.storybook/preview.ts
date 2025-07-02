import type { Preview } from '@storybook/react';

if (import.meta.env.MODE === 'storybook') {
  window.fetch = async () => new Response(null, { status: 204 });
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
