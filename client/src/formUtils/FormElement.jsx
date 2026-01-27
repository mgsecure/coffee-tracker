import TextField from '@mui/material/TextField'
import React, {useCallback, useState} from 'react'
import {alpha} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import RatingTable from '../misc/RatingTable.jsx'
import {useTheme} from '@mui/material/styles'

const FORM_DEFAULTS = {
    margin: '0px 20px 32px 0px',
    labelStyle: {fontSize: '1.0rem', fontWeight: 700},
    descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
    sectionHeaderStyle: {fontSize: '1.5rem', fontWeight: 700},
    sectionHeaderInfoStyle: {fontSize: '1.0rem', fontWeight: 400, marginLeft: 10},
    inputWidth: 80,
    inputSize: 'small',
    color: 'info'
}

export default function FormElement({
                                        fieldType = 'TextField',
                                        fieldName,
                                        fieldSettings,
                                        multiline,
                                        fullWidth,
                                        rows,
                                        label,
                                        description,
                                        options = [],
                                        otherOptionField,
                                        defaultValue,
                                        form = {},
                                        formDefaults = FORM_DEFAULTS
                                    }) {

    const theme = useTheme()
    const settings = {...formDefaults, ...fieldSettings}

    const [showOtherField, setShowOtherField] = useState(false)

    const handleRadioSelect = useCallback((event) => {
        const {value} = event.target
        if (value === 'Other') {
            setShowOtherField(true)
        } else {
            setShowOtherField(false)
            if (otherOptionField) {
                form.update({target: {name: otherOptionField, action: 'delete'}})
            }
        }
        form.update(event)
    }, [form, otherOptionField])

    const handleRatingChange = useCallback(({dimension, rating}) => {
        console.log('Rating changed: ', {dimension, rating})
        form.update({target: {name: dimension, value: rating}})
    }, [form])

    return (
        <>
            {fieldType === 'TextField' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <div style={{...settings.labelStyle, marginBottom: 2}}>{label}</div>
                    }
                    {description &&
                        <div style={{...settings.descriptionStyle, marginBottom: 2}}>{description}</div>
                    }
                    <TextField type='text'
                               name={fieldName}
                               style={{width: fullWidth ? '100%' : settings.inputWidth, margin: '6px 0px 0px 0px'}}
                               multiline={multiline}
                               fullWidth
                               rows={rows}
                               size={settings.inputSize}
                               onChange={form.update}
                               value={form.form[fieldName] || ''}
                               color={settings.color}/>
                </div>
            }

            {fieldType === 'RadioGroup' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <div style={{...settings.labelStyle, marginBottom: 2}}>{label}</div>
                    }
                    {description &&
                        <div style={{...settings.descriptionStyle, marginBottom: 2}}>{description}</div>
                    }
                    <FormControl style={{marginLeft: 6}}>
                        <RadioGroup
                            defaultValue={defaultValue || null}
                            name={fieldName}
                            value={form.form[fieldName] || null}
                            onChange={(e) => handleRadioSelect(e)}
                        >
                            {options.map(option =>
                                <FormControlLabel key={option} value={option} label={option} control={
                                    <Radio size={settings.inputSize}
                                           slotProps={{
                                               root: {style: {height: '36px', width: '36px', marginRight: '4px'}}
                                           }}/>}
                                />)
                            }
                            {otherOptionField &&
                                <div style={{display: 'flex', height: 40}}>
                                    <FormControlLabel value='Other' label='Other' control={
                                        <Radio size={settings.inputSize}
                                               slotProps={{
                                                   root: {style: {height: '36px', width: '36px', marginRight: '4px'}}
                                               }}/>
                                    }
                                    />
                                    {showOtherField &&
                                        <TextField type='text'
                                                   name={otherOptionField}
                                                   style={{width: settings.inputWidth}}
                                                   size={settings.inputSize}
                                                   onChange={form.update}
                                                   value={form.form[otherOptionField] || ''}
                                                   color={settings.color}/>
                                    }
                                </div>
                            }
                        </RadioGroup>
                    </FormControl>
                </div>
            }

            {fieldType === 'StarRating' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <div style={{marginBottom: 2, ...settings.labelStyle}}>{label}</div>
                    }
                    {description &&
                        <div style={{marginBottom: 2, ...settings.descriptionStyle}}>{description}</div>
                    }
                    <div style={{display: 'flex', placeItems: 'center', flexGrow: 0, margin: '6px 0px 0px 6px'}}>
                        <div style={{fontSize: '0.9rem', textAlign: 'right'}}>{options[0]}</div>
                        <div style={{margin: '0px 16px'}}>
                            <RatingTable ratingDimensions={{[fieldName]: '_'}}
                                         onRatingChange={handleRatingChange}
                                         ratings={{[fieldName]: form.form[fieldName] || 0}}
                                         emptyColor={alpha(theme.palette.text.secondary, 0.2)}
                                         showLabel={false}
                                         fontSize={'0.9rem'} size={25} paddingData={0} iconsCount={5}/>
                        </div>
                        <div style={{fontSize: '0.85rem'}}>{options[1]}</div>
                    </div>
                </div>
            }

            {fieldType === 'SectionHeader' &&
                <div style={{margin: '42px 0px 24px'}}>
                    <hr style={{margin: '0px 0px 4px', borderColor: '#ccc'}}/>
                    <span style={settings.sectionHeaderStyle}>{label}</span>
                    <span style={settings.sectionHeaderInfoStyle}>(Section {options[0]} of {options[1]})</span>
                    <hr style={{margin: '4px 0px 0px', borderColor: '#ccc'}}/>
                </div>
            }

            </>
    )
}