import * as React from 'react'
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { Button } from 'antd'
import './index.scss'

const CodeCopy = ({ children }: any) => {
    // console.log("children===>",children)
    const [copyOk, setCopyOk] = React.useState(false)
    const handleClick = async () => {
        // const text = children[0].props.children[0] // 获取文本
        const text = children.props.children
        if (window.isSecureContext) { // 在安全域下
            await navigator.clipboard.writeText(text) // 使用浏览器原生剪贴板
        } else {
            copy(text)
        }
        setCopyOk(true)
    }

    // 复制成功后将按钮变回"复制代码"供下次使用
    React.useEffect(() => {
        if (copyOk) {
            setTimeout(() => {
                setCopyOk(false)
            }, 1000)
        }
    }, [copyOk])
    return (
        <div className='code-copy-btn'>
            {copyOk ? (
                <Button className='copy-btn'>
                    <LoadingOutlined />
                    复制成功
                </Button>
            ) : (
                <Button className='copy-btn' onClick={handleClick}>
                    <CopyOutlined />
                    复制代码
                </Button>
            )}
        </div>
    )

}

export default CodeCopy



