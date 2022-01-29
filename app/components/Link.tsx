import type { LinkProps as MUILinkProps } from '@mui/material'
import { Link as MUILink } from '@mui/material'
import type { LinkProps as RemixLinkProps } from 'remix'
import { Link as RemixLink } from 'remix'

type LinkProps = RemixLinkProps & MUILinkProps

export default function Link(props: LinkProps) {
  return <MUILink component={RemixLink} {...props} />
}
