import React from 'react'

export default function LogRender({info = ''}) {

    console.log('render', info && info)
    return null

}