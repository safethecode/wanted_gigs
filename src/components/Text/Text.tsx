import { styled } from 'styles/stitches';
import { generateVariant } from 'utils/generateVariant';

export const Text = styled('span', {
  display: 'block',
  lineHeight: 1,
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  margin: 0,

  variants: {
    size: generateVariant('fontSizes', ['fontSize']),
    fontWeights: generateVariant('fontWeights', ['fontWeight']),
    colors: generateVariant('colors', ['color']),
  },

  defaultVariants: {
    size: 5,
    fontWeights: 5,
    colors: 'white',
  },
});
