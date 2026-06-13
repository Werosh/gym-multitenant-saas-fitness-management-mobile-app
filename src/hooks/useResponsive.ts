import { useWindowDimensions } from 'react-native';
import { layout } from '../config/theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 360;
  const isPhone = width < 768;
  const isTablet = width >= 768;

  const horizontalPadding = isSmallPhone ? 16 : isTablet ? 32 : layout.screenPadding;
  const statColumns = width >= 600 ? 3 : 2;
  const statBasis = `${100 / statColumns}%` as `${number}%`;
  const contentMaxWidth = Math.min(width, layout.maxContentWidth);
  const stackActions = width < 380;
  const formColumns = width >= 480;

  return {
    width,
    height,
    isSmallPhone,
    isPhone,
    isTablet,
    horizontalPadding,
    statColumns,
    statBasis,
    contentMaxWidth,
    stackActions,
    formColumns,
  };
}

export function getStatItemStyle(columns: number) {
  const gap = 8;
  const basis = (100 / columns).toFixed(4);
  return {
    width: `${basis}%` as `${number}%`,
    paddingHorizontal: gap / 2,
    marginBottom: gap,
  };
}
