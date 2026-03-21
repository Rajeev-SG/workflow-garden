/* eslint-disable react-hooks/static-components */

import * as runtime from "react/jsx-runtime"
import type { ComponentProps, ComponentType, ReactElement, ReactNode } from "react"
import Link from "next/link"
import { codeToHtml } from "shiki"

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

async function CodeBlock(props: ComponentProps<"pre">) {
  const child = props.children as
    | ReactElement<{ className?: string; children?: ReactNode }>
    | undefined

  const className = child?.props?.className ?? ""
  const language = className.replace("language-", "") || "text"
  const rawCode = typeof child?.props?.children === "string"
    ? child.props.children
    : Array.isArray(child?.props?.children)
      ? child.props.children.join("")
      : ""

  const html = await codeToHtml(rawCode, {
    lang: language,
    theme: "github-light",
  })

  return (
    <div
      className="archive-code-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const sharedComponents = {
  a: ({
    href,
    children,
    ...props
  }: ComponentProps<"a">) => {
    if (!href) {
      return <a {...props}>{children}</a>
    }

    const isInternal = href.startsWith("/")

    if (isInternal) {
      return (
        <Link href={href} className="archive-inline-link" {...props}>
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        className="archive-inline-link"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  pre: CodeBlock,
}

export function MDXContent({
  code,
  components,
}: {
  code: string
  components?: Record<string, ComponentType>
}) {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
