export const PADDING = "px-3 py-1";
export const ROUNDED = "rounded-lg";
export const SHADOW = `shadow-md shadow-grim/50 dark:shadow-aliexpress/50`;

export const TEXT_GRADIENT = `bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-aliexpress`;
export const BG_GRADIENT = `bg-gradient-to-r from-amber-500 to-aliexpress`;
export const BG_TRANSPARENT_BACKDROP = `backdrop-blur-md bg-black/5 dark:bg-black/50`;

export const BUTTON_VARIANTS = {
  solid: ` bg-aliexpress font-bold text-center text-white transition duration-500 ease-in-out transform hover:bg-darkTransparent dark:hover:lightTransparent ${PADDING} ${ROUNDED} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `,
  outline: ` font-bold text-center transition duration-500 ease-in-out transform hover:underline hover:decoration-aliexpress hover:text-aliexpress disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `,
};

export const TEXT_INPUT = ` border-0 border-b border-grim dark:border-aliexpress caret-grim dark:caret-white focus:outline focus:border-none focus:ring-0 focus:outline-aliexpress ${BG_TRANSPARENT_BACKDROP} ${ROUNDED} ${PADDING} `;
