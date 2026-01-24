import React from 'react'

function FieldValue({name, value, last, style, headerStyle = {}, textStyle = {}, suffix, prefix, fallback, center=false}) {
    const alignStyle = center ? {textAlign: 'center'} : {marginLeft: 5}
    const marginStyle = last
        ? {...alignStyle, ...style}
        : {marginBottom: 8, ...alignStyle, ...style}
    const fullHeaderStyle = {
        color: '#888',
        fontSize: '0.85rem',
        textAlign: center ? 'center' : 'left',
        ...headerStyle
    }
    const fullTextStyle = {
        ...alignStyle,
        ...textStyle
    }

    if (!value && !fallback) return null

    const displayValue = (prefix || suffix) ? [prefix,value,suffix].filter(Boolean).join('') : value || fallback
    return (
        <div style={marginStyle}>
            <div style={fullHeaderStyle}>
                {name}
            </div>
            <div style={fullTextStyle}>
                {displayValue}
            </div>
        </div>
    )
}

export default React.memo(FieldValue)
