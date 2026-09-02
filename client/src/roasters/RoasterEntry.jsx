import React from 'react'
import FieldValue from '../misc/FieldValue'
import FilterChip from '../filters/FilterChip'
import OpenLinkInNewTabButton from '../misc/OpenLinkInNewTabButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import isValidUrl from '../util/isValidUrl'
import {useTheme, lighten} from '@mui/material/styles'
import {alpha} from '@mui/material'

function RoasterEntry({entry}) {
    const {isMobile} = useWindowSize()
    const theme = useTheme()

    const entryFullName = entry.name
    const entryLink = isValidUrl(entry.link) ? entry.link : undefined

    // todo - make location & separators a component (no FilterChip)
    const citySep = (entry.city && (entry.stateRegion || entry.country)) ? ', ' : ''
    const stateSep = (entry.stateRegion && entry.country) ? ', ' : ''
    const locationColor = alpha(theme.palette.text.primary, 0.6)

    const style = {
        width: '100%',
        maxWidth: 800,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),
        borderBottom: '1px solid ' + theme.palette.divider,
    }

    // TODO - don't bring in FilterChip, just render here. Fix add filter for new style.

    return (
        <div style={style} role='listitem' aria-label={entryFullName}>
            <div style={{
                padding: isMobile ? '5px 10px 4px 10px' : '5px 20px 4px 20px',
                width: '100%',
                flexShrink: 0,
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <div style={{
                        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                        flexGrow: 1, width: isMobile ? '100%' : 'auto'
                    }}>
                        <div style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.4rem',
                            fontWeight: 600,
                            marginBottom: 4,
                            marginRight: 16
                        }}>
                            {entry.name}
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.6rem',
                            flexGrow: 1,
                            textAlign: 'left',
                            color: locationColor
                        }}>
                            <FilterChip value={entry.city} field='city' mode='text' linkColor={locationColor}/>
                            {citySep}
                            <FilterChip value={entry.stateRegion} field='stateRegion' mode='text'
                                        linkColor={locationColor}/>
                            {stateSep}
                            <FilterChip value={entry.country} field='country' mode='text'
                                        linkColor={locationColor}/>
                        </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <FieldValue name={isMobile ? 'Roastful' : 'Roastful Rank'}
                                    value={entry.roastfulRanking}
                                    style={{marginLeft: 0, marginRight: 20}}
                                    center={true}/>
                        <FieldValue name={isMobile ? 'Reddit' : 'Reddit Votes'}
                                    value={entry.pouroverVotes}
                                    fallback={'--'}
                                    style={{marginLeft: 0, marginRight: 10}}
                                    center={true}/>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: 36,
                            height: 36,
                            margin: '0px 0px'
                        }}>
                            <OpenLinkInNewTabButton url={entryLink} entryType='Roaster'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(RoasterEntry, (prevProps, nextProps) => {
    return prevProps.entry.id === nextProps.entry.id &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})
