import { CopyOutlined, FolderOpenOutlined, ImportOutlined, LoginOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Input, Steps } from 'antd'
import { useEffect, type ReactNode } from 'react'
import Hyperspeed from 'extends-react/src/Hyperspeed'
import type { LocalCodexSetupState } from '../../protocol'
import useSetupRendererStore from './store'

function currentStepGet(state: LocalCodexSetupState): number {
  if (state.phase === 'ready') return 3
  if (!state.mcpReady) return 0
  if (state.workspaceRoot === undefined || !state.workspaceReady) return 1
  return 2
}

export default function SetupApp() {
  const setup = useSetupRendererStore((store) => store.setup)
  const setupActions = useSetupRendererStore((store) => store.setupActions)

  useEffect(() => setupActions.stateSubscribe(), [setupActions])

  const current = currentStepGet(setup.state)
  const error = setup.actionError ?? (setup.state.phase === 'error' ? setup.state.message : undefined)
  const normalLoginEnabled = setup.state.phase === 'needs-login' && setup.state.login === 'signed-out'
  const loginCopyEnabled = setup.state.login === 'signed-in' && setup.username.trim().length > 0
  const withError = (description: ReactNode, index: number): ReactNode => {
    if (error === undefined || index !== current) return description
    return (
      <>
        {description}
        <div role="alert">
          {error}
          {setup.state.phase === 'error' && (
            <Button
              aria-label="重新加载 ChatGPT"
              icon={<ReloadOutlined />}
              onClick={() => void setupActions.actionRun({ type: 'chatgpt-reload' })}
              title="重新加载 ChatGPT"
              type="text"
            />
          )}
        </div>
      </>
    )
  }
  const items = [
    {
      title: 'MCP server 服务',
      description: withError(setup.state.mcpReady ? `${setup.state.toolCount} 个工具已就绪` : '正在启动', 0)
    },
    {
      title: 'workspace 工作区',
      description: withError(
        <>
          {setup.state.workspaceRoot ?? '未选择'}
          <Button
            aria-label="选择工作区"
            disabled={!setup.state.mcpReady}
            icon={<FolderOpenOutlined />}
            onClick={() => void setupActions.actionRun({ type: 'choose-workspace' })}
            title="选择工作区"
            type="text"
          />
        </>,
        1
      )
    },
    {
      title: 'ChatGPT 登录',
      description: withError(
        <>
          {setup.state.login === 'checking' && '正在检查'}
          {setup.state.login === 'signed-out' && (
            <>
              <Button
                aria-label="普通登录 ChatGPT"
                disabled={!normalLoginEnabled}
                icon={<LoginOutlined />}
                onClick={() => void setupActions.actionRun({ type: 'chatgpt-login-open' })}
                title="普通登录 ChatGPT"
                type="text"
              />
              <Button
                aria-label="从剪贴板导入登录态"
                icon={<ImportOutlined />}
                onClick={() => void setupActions.actionRun({ type: 'login-state-paste' })}
                title="从剪贴板导入登录态"
                type="text"
              />
            </>
          )}
          {setup.state.login === 'signed-in' && (
            <Input
              aria-label="导出账号标记"
              onChange={(event) => setupActions.usernameSet(event.target.value)}
              placeholder="账号标记"
              suffix={(
                <Button
                  aria-label="复制登录态"
                  disabled={!loginCopyEnabled}
                  icon={<CopyOutlined />}
                  onClick={() => void setupActions.actionRun({ type: 'login-state-copy', username: setup.username })}
                  title="复制登录态"
                  type="text"
                />
              )}
              value={setup.username}
            />
          )}
        </>,
        2
      )
    }
  ]

  return (
    <main style={styles.main}>
      <div aria-hidden="true" style={styles.background}>
        <Hyperspeed />
      </div>
      <ConfigProvider theme={{ token: {
        colorBgContainer: 'transparent',
        colorBorder: 'rgb(255 255 255 / 64%)',
        colorBorderSecondary: 'rgb(255 255 255 / 42%)',
        colorIcon: 'rgb(255 255 255 / 86%)',
        colorIconHover: '#ffffff',
        colorPrimary: setup.highlightColor,
        colorSplit: 'rgb(255 255 255 / 42%)',
        colorText: 'rgb(255 255 255 / 92%)',
        colorTextBase: '#ffffff',
        colorTextDescription: 'rgb(255 255 255 / 76%)',
        colorTextHeading: '#ffffff'
      } }}>
        <section aria-live="polite" style={styles.steps}>
          <Steps current={current}  items={items} status={error === undefined ? 'process' : 'error'} />
        </section>
      </ConfigProvider>
    </main>
  )
}

const styles = {
  main: {
    inset: 0,
    overflow: 'hidden',
    position: 'fixed'
  },
  background: {
    inset: 0,
    position: 'absolute'
  },
  steps: {
    margin: 'auto',
    padding: 24,
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  }
} as const
