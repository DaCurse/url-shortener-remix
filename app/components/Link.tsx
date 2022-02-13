import type { LinkProps as MuiLinkProps } from '@mui/material'
import { Link as MuiLink } from '@mui/material'
import type { LinkProps as RemixLinkProps } from 'remix'
import { Link as RemixLink } from 'remix'

type LinkProps = RemixLinkProps & MuiLinkProps

export default function Link(props: LinkProps) {
  return <MuiLink component={RemixLink} {...props} />
}
