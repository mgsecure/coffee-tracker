import React from 'react'
import introCopyData from '../data/introCopy.json'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import Box from '@mui/material/Box'
import {useTheme} from '@mui/material/styles'

export default function IntroCopy({pageName, maxWidth = 800}) {
    const navigate = useNavigate()
    const theme = useTheme()

    const intro = introCopyData[pageName]


    if (intro) {
        return (
            <div style={{marginLeft: 'auto', marginRight: 'auto', width: '100%'}}>
                <Box style={{
                    maxWidth: maxWidth,
                    padding: '10px 8px 0px 0px',
                    fontSize: '1rem',
                    lineHeight: '1.35rem'
                }} sx={{'a': {color: theme.palette.primary.main}}}>
                    <div style={{fontSize: '1.2rem', fontWeight: 600}}>{intro.title}</div>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]} remarkPlugins={[remarkGfm]}>
                        {intro.copy}
                    </ReactMarkdown>
                    {intro.link && intro.destination &&
                        <React.Fragment>
                            &nbsp;<Link onClick={() => {
                            navigate(intro.destination)
                        }} style={{color: '#aaa', cursor: 'pointer'}}>{intro.link}</Link>
                        </React.Fragment>
                    }
                </Box>
            </div>
        )
    }
}