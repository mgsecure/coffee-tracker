import TextField from '@mui/material/TextField'
import React, {useCallback, useState} from 'react'
import {alpha} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import RatingTable from '../misc/RatingTable.jsx'
import {useTheme} from '@mui/material/styles'

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
                                        handleFormChange,
                                        formDefaults = {
                                            margin: '0px 20px 32px 0px',
                                            labelStyle: {fontSize: '1.0rem', fontWeight: 700},
                                            descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
                                            inputWidth: 80,
                                            inputSize: 'small',
                                            color: 'info'
                                        }
                                    }) {

    const settings = {...formDefaults, ...fieldSettings}
    const theme = useTheme()

    const [showOtherField, setShowOtherField] = useState(false)
    const handleRadioSelect = useCallback((event) => {
        const {value} = event.target
        if (value === 'other') {
            setShowOtherField(true)
        } else {
            setShowOtherField(false)
            if (otherOptionField) {
                handleFormChange({target: {name: otherOptionField, action: 'delete'}})
            }
        }
        handleFormChange(event)
    }, [handleFormChange, otherOptionField])

    const handleRatingChange = useCallback(({dimension, rating}) => {
        console.log('Rating changed: ', {dimension, rating})
        //setRatings({...ratings, [dimension]: rating})
        //setRatingsChanged(true)
    }, [])

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
                               onChange={handleFormChange}
                               value={form[fieldName] || ''}
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
                            defaultValue={defaultValue}
                            name={fieldName}
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
                                                   onChange={handleFormChange}
                                                   value={form[otherOptionField] || ''}
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
                        <div style={{...settings.labelStyle, marginBottom: 2}}>{label}</div>
                    }
                    {description &&
                        <div style={{...settings.descriptionStyle, marginBottom: 2}}>{description}</div>
                    }
                    <div style={{display: 'flex', placeItems: 'center', flexGrow: 0, margin: '6px 0px 0px 6px'}}>
                        <div style={{fontSize: '0.9rem', textAlign: 'right'}}>Not Satisfied</div>
                        <div style={{margin: '0px 16px'}}>
                            <RatingTable ratingDimensions={[fieldName]} onRatingChange={handleRatingChange}
                                         ratings={{}} emptyColor={alpha(theme.palette.text.secondary, 0.2)}
                                         showLabel={false}
                                         fontSize={'0.9rem'} size={25} paddingData={0} iconsCount={5}/>
                        </div>
                        <div style={{fontSize: '0.85rem'}}>Extremely Satisfied</div>

                    </div>
                </div>
            }
        </>
    )
}