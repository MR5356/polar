export namespace SystemModels {
  export interface Website {
    title: string
    subTitle?: string
    favicon: string
    logo: string
    copyright?: string
    miit?: string
    beian?: string
  }

  export interface Navigation {
    title: string
    path?: string
    icon?: string
    selectedIcon?: string
    children?: Navigation[]
    order?: number
    expand?: boolean
  }

  export const defaultNavigation: Navigation[] = [
    // {
    //   title: 'Home',
    //   path: '/',
    //   icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik02LjU3MTk4IDM3LjQyOEMzLjcwNTI3IDMzLjcxMjggMiAyOS4wNTU2IDIgMjRDMiAxMS44NDk3IDExLjg0OTcgMiAyNCAyQzM2LjE1MDMgMiA0NiAxMS44NDk3IDQ2IDI0QzQ2IDI5LjA1NTYgNDQuMjk0NyAzMy43MTI4IDQxLjQyOCAzNy40MjgiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIuMzAzNSAzMS42OTY1QzEwLjg0NzQgMjkuNDg4MSAxMCAyNi44NDMgMTAgMjRDMTAgMTYuMjY4IDE2LjI2OCAxMCAyNCAxMEMzMS43MzIgMTAgMzggMTYuMjY4IDM4IDI0QzM4IDI2Ljg0MyAzNy4xNTI2IDI5LjQ4ODEgMzUuNjk2NSAzMS42OTY1IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAzMEw0MCA0Nkg4TDI0IDMwWiIgZmlsbD0iIzZhYmFmMyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
    //   children: [
    //     {
    //       title: 'Test1',
    //       path: '/test1',
    //       icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik02LjU3MTk4IDM3LjQyOEMzLjcwNTI3IDMzLjcxMjggMiAyOS4wNTU2IDIgMjRDMiAxMS44NDk3IDExLjg0OTcgMiAyNCAyQzM2LjE1MDMgMiA0NiAxMS44NDk3IDQ2IDI0QzQ2IDI5LjA1NTYgNDQuMjk0NyAzMy43MTI4IDQxLjQyOCAzNy40MjgiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIuMzAzNSAzMS42OTY1QzEwLjg0NzQgMjkuNDg4MSAxMCAyNi44NDMgMTAgMjRDMTAgMTYuMjY4IDE2LjI2OCAxMCAyNCAxMEMzMS43MzIgMTAgMzggMTYuMjY4IDM4IDI0QzM4IDI2Ljg0MyAzNy4xNTI2IDI5LjQ4ODEgMzUuNjk2NSAzMS42OTY1IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAzMEw0MCA0Nkg4TDI0IDMwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=='
    //     },
    //     {
    //       title: 'Test2',
    //       path: '/test2',
    //       icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xOC4yODM4IDQzLjE3MTNDMTQuOTMyNyA0Mi4xNzM2IDExLjk0OTggNDAuMzIxMyA5LjU4Nzg3IDM3Ljg2N0MxMC40NjkgMzYuODIyNyAxMSAzNS40NzM0IDExIDM0LjAwMDFDMTEgMzAuNjg2NCA4LjMxMzcxIDI4LjAwMDEgNSAyOC4wMDAxQzQuNzk5NTUgMjguMDAwMSA0LjYwMTM5IDI4LjAxIDQuNDA1OTkgMjguMDI5MkM0LjEzOTc5IDI2LjcyNzcgNCAyNS4zODAzIDQgMjQuMDAwMUM0IDIxLjkwOTUgNC4zMjA3NyAxOS44OTM4IDQuOTE1NzkgMTcuOTk5NUM0Ljk0MzgxIDE3Ljk5OTkgNC45NzE4OCAxOC4wMDAxIDUgMTguMDAwMUM4LjMxMzcxIDE4LjAwMDEgMTEgMTUuMzEzOCAxMSAxMi4wMDAxQzExIDExLjA0ODggMTAuNzc4NiAxMC4xNDkzIDEwLjM4NDYgOS4zNTAxMUMxMi42OTc1IDcuMTk5NSAxNS41MjA1IDUuNTkwMDIgMTguNjUyMSA0LjcyMzE0QzE5LjY0NDQgNi42NjgxOSAyMS42NjY3IDguMDAwMTMgMjQgOC4wMDAxM0MyNi4zMzMzIDguMDAwMTMgMjguMzU1NiA2LjY2ODE5IDI5LjM0NzkgNC43MjMxNEMzMi40Nzk1IDUuNTkwMDIgMzUuMzAyNSA3LjE5OTUgMzcuNjE1NCA5LjM1MDExQzM3LjIyMTQgMTAuMTQ5MyAzNyAxMS4wNDg4IDM3IDEyLjAwMDFDMzcgMTUuMzEzOCAzOS42ODYzIDE4LjAwMDEgNDMgMTguMDAwMUM0My4wMjgxIDE4LjAwMDEgNDMuMDU2MiAxNy45OTk5IDQzLjA4NDIgMTcuOTk5NUM0My42NzkyIDE5Ljg5MzggNDQgMjEuOTA5NSA0NCAyNC4wMDAxQzQ0IDI1LjM4MDMgNDMuODYwMiAyNi43Mjc3IDQzLjU5NCAyOC4wMjkyQzQzLjM5ODYgMjguMDEgNDMuMjAwNSAyOC4wMDAxIDQzIDI4LjAwMDFDMzkuNjg2MyAyOC4wMDAxIDM3IDMwLjY4NjQgMzcgMzQuMDAwMUMzNyAzNS40NzM0IDM3LjUzMSAzNi44MjI3IDM4LjQxMjEgMzcuODY3QzM2LjA1MDIgNDAuMzIxMyAzMy4wNjczIDQyLjE3MzYgMjkuNzE2MiA0My4xNzEzQzI4Ljk0MjggNDAuNzUyIDI2LjY3NiAzOS4wMDAxIDI0IDM5LjAwMDFDMjEuMzI0IDM5LjAwMDEgMTkuMDU3MiA0MC43NTIgMTguMjgzOCA0My4xNzEzWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjQgMzFDMjcuODY2IDMxIDMxIDI3Ljg2NiAzMSAyNEMzMSAyMC4xMzQgMjcuODY2IDE3IDI0IDE3QzIwLjEzNCAxNyAxNyAyMC4xMzQgMTcgMjRDMTcgMjcuODY2IDIwLjEzNCAzMSAyNCAzMVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+',
    //       children: [
    //         {
    //           title: 'Test3',
    //           path: '/test3',
    //           icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik02LjU3MTk4IDM3LjQyOEMzLjcwNTI3IDMzLjcxMjggMiAyOS4wNTU2IDIgMjRDMiAxMS44NDk3IDExLjg0OTcgMiAyNCAyQzM2LjE1MDMgMiA0NiAxMS44NDk3IDQ2IDI0QzQ2IDI5LjA1NTYgNDQuMjk0NyAzMy43MTI4IDQxLjQyOCAzNy40MjgiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIuMzAzNSAzMS42OTY1QzEwLjg0NzQgMjkuNDg4MSAxMCAyNi44NDMgMTAgMjRDMTAgMTYuMjY4IDE2LjI2OCAxMCAyNCAxMEMzMS43MzIgMTAgMzggMTYuMjY4IDM4IDI0QzM4IDI2Ljg0MyAzNy4xNTI2IDI5LjQ4ODEgMzUuNjk2NSAzMS42OTY1IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAzMEw0MCA0Nkg4TDI0IDMwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=='
    //         },
    //       ]
    //     }
    //   ]
    // },
    {
      title: 'navigation.dashboard',
      path: '/dashboard',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik02LjU3MTk4IDM3LjQyOEMzLjcwNTI3IDMzLjcxMjggMiAyOS4wNTU2IDIgMjRDMiAxMS44NDk3IDExLjg0OTcgMiAyNCAyQzM2LjE1MDMgMiA0NiAxMS44NDk3IDQ2IDI0QzQ2IDI5LjA1NTYgNDQuMjk0NyAzMy43MTI4IDQxLjQyOCAzNy40MjgiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIuMzAzNSAzMS42OTY1QzEwLjg0NzQgMjkuNDg4MSAxMCAyNi44NDMgMTAgMjRDMTAgMTYuMjY4IDE2LjI2OCAxMCAyNCAxMEMzMS43MzIgMTAgMzggMTYuMjY4IDM4IDI0QzM4IDI2Ljg0MyAzNy4xNTI2IDI5LjQ4ODEgMzUuNjk2NSAzMS42OTY1IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAzMEw0MCA0Nkg4TDI0IDMwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=='
    },
    {
      title: 'navigation.pipeline',
      path: '/pipeline',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yNCA0QzE2LjI2OCA0IDEwIDEwLjI2OCAxMCAxOFYzOEgzOFYxOEMzOCAxMC4yNjggMzEuNzMyIDQgMjQgNFoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTAgMzhWMThDMTAgMTAuMjY4IDE2LjI2OCA0IDI0IDRDMzEuNzMyIDQgMzggMTAuMjY4IDM4IDE4VjM4TTQgMzhINDQiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjQgNDRDMjYuNzYxNCA0NCAyOSA0MS43NjE0IDI5IDM5VjM4SDE5VjM5QzE5IDQxLjc2MTQgMjEuMjM4NiA0NCAyNCA0NFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4='
    },
    {
      title: 'navigation.schedule',
      path: '/schedule',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjI0IiBjeT0iMjgiIHI9IjE2IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0yOCA0TDIwIDQiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjQgNFYxMiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zNSAxNkwzOCAxMyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNCAyOFYyMiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNCAyOEgxOCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
      children: [
        {
          title: 'navigation.scheduleList',
          path: '/schedule/list',
        },
        {
          title: 'navigation.scheduleRecord',
          path: '/schedule/record',
        },
      ]
    },
    {
      title: 'navigation.notification',
      path: '/notification',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yNCA0QzE2LjI2OCA0IDEwIDEwLjI2OCAxMCAxOFYzOEgzOFYxOEMzOCAxMC4yNjggMzEuNzMyIDQgMjQgNFoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTAgMzhWMThDMTAgMTAuMjY4IDE2LjI2OCA0IDI0IDRDMzEuNzMyIDQgMzggMTAuMjY4IDM4IDE4VjM4TTQgMzhINDQiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjQgNDRDMjYuNzYxNCA0NCAyOSA0MS43NjE0IDI5IDM5VjM4SDE5VjM5QzE5IDQxLjc2MTQgMjEuMjM4NiA0NCAyNCA0NFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4='
    },
    {
      title: 'navigation.scm',
      path: '/scm',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNiAxM0w0IDI1LjQzMjJMMTYgMzciIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMzIgMTNMNDQgMjUuNDMyMkwzMiAzNyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yOCA0TDIxIDQ0IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+'
    },
    {
      title: 'navigation.package',
      path: '/package',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00NCAxNEwyNCA0TDQgMTRWMzRMMjQgNDRMNDQgMzRWMTRaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik00IDE0TDI0IDI0IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI0IDQ0VjI0IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTQ0IDE0TDI0IDI0IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTM0IDlMMTQgMTkiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4='
    },
    {
      title: 'navigation.setting',
      path: '/setting',
      icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xOC4yODM4IDQzLjE3MTNDMTQuOTMyNyA0Mi4xNzM2IDExLjk0OTggNDAuMzIxMyA5LjU4Nzg3IDM3Ljg2N0MxMC40NjkgMzYuODIyNyAxMSAzNS40NzM0IDExIDM0LjAwMDFDMTEgMzAuNjg2NCA4LjMxMzcxIDI4LjAwMDEgNSAyOC4wMDAxQzQuNzk5NTUgMjguMDAwMSA0LjYwMTM5IDI4LjAxIDQuNDA1OTkgMjguMDI5MkM0LjEzOTc5IDI2LjcyNzcgNCAyNS4zODAzIDQgMjQuMDAwMUM0IDIxLjkwOTUgNC4zMjA3NyAxOS44OTM4IDQuOTE1NzkgMTcuOTk5NUM0Ljk0MzgxIDE3Ljk5OTkgNC45NzE4OCAxOC4wMDAxIDUgMTguMDAwMUM4LjMxMzcxIDE4LjAwMDEgMTEgMTUuMzEzOCAxMSAxMi4wMDAxQzExIDExLjA0ODggMTAuNzc4NiAxMC4xNDkzIDEwLjM4NDYgOS4zNTAxMUMxMi42OTc1IDcuMTk5NSAxNS41MjA1IDUuNTkwMDIgMTguNjUyMSA0LjcyMzE0QzE5LjY0NDQgNi42NjgxOSAyMS42NjY3IDguMDAwMTMgMjQgOC4wMDAxM0MyNi4zMzMzIDguMDAwMTMgMjguMzU1NiA2LjY2ODE5IDI5LjM0NzkgNC43MjMxNEMzMi40Nzk1IDUuNTkwMDIgMzUuMzAyNSA3LjE5OTUgMzcuNjE1NCA5LjM1MDExQzM3LjIyMTQgMTAuMTQ5MyAzNyAxMS4wNDg4IDM3IDEyLjAwMDFDMzcgMTUuMzEzOCAzOS42ODYzIDE4LjAwMDEgNDMgMTguMDAwMUM0My4wMjgxIDE4LjAwMDEgNDMuMDU2MiAxNy45OTk5IDQzLjA4NDIgMTcuOTk5NUM0My42NzkyIDE5Ljg5MzggNDQgMjEuOTA5NSA0NCAyNC4wMDAxQzQ0IDI1LjM4MDMgNDMuODYwMiAyNi43Mjc3IDQzLjU5NCAyOC4wMjkyQzQzLjM5ODYgMjguMDEgNDMuMjAwNSAyOC4wMDAxIDQzIDI4LjAwMDFDMzkuNjg2MyAyOC4wMDAxIDM3IDMwLjY4NjQgMzcgMzQuMDAwMUMzNyAzNS40NzM0IDM3LjUzMSAzNi44MjI3IDM4LjQxMjEgMzcuODY3QzM2LjA1MDIgNDAuMzIxMyAzMy4wNjczIDQyLjE3MzYgMjkuNzE2MiA0My4xNzEzQzI4Ljk0MjggNDAuNzUyIDI2LjY3NiAzOS4wMDAxIDI0IDM5LjAwMDFDMjEuMzI0IDM5LjAwMDEgMTkuMDU3MiA0MC43NTIgMTguMjgzOCA0My4xNzEzWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjQgMzFDMjcuODY2IDMxIDMxIDI3Ljg2NiAzMSAyNEMzMSAyMC4xMzQgMjcuODY2IDE3IDI0IDE3QzIwLjEzNCAxNyAxNyAyMC4xMzQgMTcgMjRDMTcgMjcuODY2IDIwLjEzNCAzMSAyNCAzMVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'
    }
  ]

  export function setNavigationExpand(path: string, navs: Navigation[]) {
    // get parent map
    const parentMap: { [path: string]: Navigation } = {}
    for (const nav of navs) {
      parentMap[nav.title] = nav
      if (nav.children) {
        for (const child of nav.children) {
          parentMap[child.title] = nav
        }
      }
    }
  }

  export const defaultWebsite: Website = {
    title: 'Aurora',
    favicon: '/logo.svg',
    logo: '/logo.svg',
    copyright: 'Copyright © 2024 Aurora.'
  }

  export function setWebsite(website: Website) {
    if (website.title) document.title = website.title
    if (website.favicon) {
      const link = (document.querySelector('link[rel*="icon"]') || document.createElement('link')) as HTMLLinkElement
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = website.favicon
      document.getElementsByTagName('head')[0].appendChild(link)
    }
  }
}