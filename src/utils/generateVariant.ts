import { StandardProperties } from '@stitches/react/types/css';
import { theme, CSS } from 'styles/stitches';

export type VariantObject = { [Pair in number | string]: CSS };

export const generateVariant = (
  themeKey: keyof typeof theme,
  cssProperties: Array<keyof StandardProperties>,
) => {
  const themeObj = theme[themeKey];
  return (
    Object.keys(theme[themeKey]) as unknown as Array<keyof typeof themeObj>
  ).reduce(
    (obj, key) => ({
      ...obj,
      [key]: cssProperties.reduce(
        (valObj, cssProperty) => ({ ...valObj, [cssProperty]: `$${key}` }),
        {} as VariantObject[string],
      ),
    }),
    {} as VariantObject,
  );
};
