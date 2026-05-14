import { Alert, Button } from 'antd'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {}

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg p-8 pt-16">
          <Alert
            type="error"
            showIcon
            message="Module fault"
            description={this.state.error.message}
            action={
              <Button type="primary" onClick={() => window.location.reload()}>
                Reload console
              </Button>
            }
          />
        </div>
      )
    }
    return this.props.children
  }
}
