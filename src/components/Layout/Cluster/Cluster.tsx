import React from 'react'
import styled, { css } from 'styled-components'
import { AbstractSize, CharRelativeSize } from '../../../themes/createSpacing'
import { useSpacing } from '../../../hooks/useSpacing'

type alignMethod = 'normal' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
type justifyMethod = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'

/**
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param rowGap 垂直方向の間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param columnGap 水平方向の間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param align 垂直方向の揃え方（align-items）
 * @param justify 水平方向の揃え方（justify-content）
 * @param as ネガティブマージンを隠す要素の HTML タグ名
 * @param bodyAs Cluster 本体の HTML タグ名
 * @param children 均等に間隔を空けたい要素群
 */
export const Cluster: React.VFC<{
  rowGap?: CharRelativeSize | AbstractSize
  columnGap?: CharRelativeSize | AbstractSize
  gap?: CharRelativeSize | AbstractSize
  align?: alignMethod
  justify?: justifyMethod
  as?: React.ElementType
  bodyAs?: React.ElementType
  children?: React.ReactNode
}> = ({ gap = 0.5, rowGap, columnGap, align, justify, as, bodyAs, children }) => (
  <Wrapper as={as}>
    <Body
      as={bodyAs}
      rowGap={rowGap}
      columnGap={columnGap}
      gap={gap}
      align={align}
      justify={justify}
    >
      {children}
    </Body>
  </Wrapper>
)

// gap のネガティブマージンを隠すための要素、gap が利用できる場合は不要
// Wrapper to hide the negative margin of gap, not required if gap is available.
const Wrapper = styled.div`
  display: block; /* expect it to always be "block" */
  overflow: hidden;

  @supports (gap: 1px) {
    overflow: revert;
  }
`
const Body = styled.div<{
  rowGap?: CharRelativeSize | AbstractSize
  columnGap?: CharRelativeSize | AbstractSize
  gap: CharRelativeSize | AbstractSize
  align?: alignMethod
  justify?: justifyMethod
}>(({ rowGap, columnGap, gap, align, justify }) => {
  const verticalGap = rowGap != null ? useSpacing(rowGap) : useSpacing(gap)
  const horizontalGap = columnGap != null ? useSpacing(columnGap) : useSpacing(gap)

  return css`
    display: flex;
    flex-wrap: wrap;
    ${align && `align-items: ${align};`}
    ${justify && `justify-content: ${justify};`}
    margin: calc(${verticalGap} / 2 * -1) calc(${horizontalGap} / 2 * -1);

    > * {
      margin: calc(${verticalGap} / 2) calc(${horizontalGap} / 2);
    }

    @supports (gap: 1px) {
      margin: revert;
      row-gap: ${verticalGap};
      column-gap: ${horizontalGap};

      > * {
        margin: revert;
      }
    }
  `
})
