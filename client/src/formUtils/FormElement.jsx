import TextField from '@mui/material/TextField'
import React, {useCallback, useState} from 'react'
import {alpha, Checkbox} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import RatingTable from '../misc/RatingTable.jsx'
import {useTheme} from '@mui/material/styles'

import Typography from '@mui/material/Typography'
import SelectBox from './SelectBox.jsx'

const FORM_DEFAULTS = {
    margin: '0px 20px 32px 0px',
    labelStyle: {fontSize: '1.0rem', fontWeight: 700},
    descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
    sectionHeaderStyle: {fontSize: '1.5rem', fontWeight: 700},
    sectionHeaderInfoStyle: {fontSize: '1.0rem', fontWeight: 400, margin: '0px 0px 0px 10px'},
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

    const handleCheckboxSelect = useCallback((event) => {
        const {name, value, checked} = event.target
        const selectedOptions = form.form[name] || []

        if (checked===true) {
            selectedOptions.push(value)
        } else {
            selectedOptions.splice(selectedOptions.indexOf(value), 1)
        }
        form.update({target: {name, value: selectedOptions}})

        if (value === 'Other' && checked===true) {
            setShowOtherField(true)
        } else if (value === 'Other' && checked===false) {
            setShowOtherField(false)
            if (otherOptionField) {
                form.update({target: {name: otherOptionField, action: 'delete'}})
            }
        }
    }, [form, otherOptionField])

    const handleRatingChange = useCallback(({dimension, rating}) => {
        console.log('Rating changed: ', {dimension, rating})
        form.update({target: {name: dimension, value: rating}})
    }, [form])

    return (
        <>
            {fieldType === 'SectionHeader' &&
                <div style={{margin: '42px 0px 24px'}}>
                    <hr style={{margin: '0px 0px 4px', borderColor: '#ccc'}}/>
                    <Typography component='span' sx={settings.sectionHeaderStyle}>{label}</Typography>
                    <Typography component='span'
                                sx={settings.sectionHeaderInfoStyle}>(Section {options[0]} of {options[1]})</Typography>
                    <hr style={{margin: '4px 0px 0px', borderColor: '#ccc'}}/>
                </div>
            }

            {fieldType === 'TextField' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <Typography sx={{...settings.labelStyle, marginBottom: '2px'}}>{label}</Typography>
                    }
                    {description &&
                        <Typography sx={{...settings.descriptionStyle, marginBottom: '2px'}}>{description}</Typography>
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

            {fieldType === 'SelectBox' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <Typography sx={{...settings.labelStyle, marginBottom: '2px'}}>{label}</Typography>
                    }
                    {description &&
                        <Typography sx={{...settings.descriptionStyle, marginBottom: '2px'}}>{description}</Typography>
                    }
                    <SelectBox type='text'
                               name={fieldName}
                               optionsList={options}
                               form={form.form}
                               label={label}
                               multiple={false}
                               defaultValue={defaultValue || ''}
                               style={{margin: '6px 0px 0px 0px'}}
                               width={fullWidth ? '100%' : settings.inputWidth}
                               size={settings.inputSize}
                               changeHandler={form.update}
                               value={form.form[fieldName] || ''}
                               color={settings.color}/>
                </div>
            }

            {fieldType === 'RadioGroup' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <Typography sx={{...settings.labelStyle, marginBottom: '2px'}}>{label}</Typography>
                    }
                    {description &&
                        <Typography sx={{...settings.descriptionStyle, marginBottom: '2px'}}>{description}</Typography>
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
                                    <FormControlLabel key='Other' value='Other' label='Other' control={
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

            {fieldType === 'Checkboxes' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <Typography sx={{...settings.labelStyle, marginBottom: '2px'}}>{label}</Typography>
                    }
                    {description &&
                        <Typography sx={{...settings.descriptionStyle, marginBottom: '2px'}}>{description}</Typography>
                    }
                    <FormControl style={{marginLeft: 6}}>
                        {options.map(option =>
                            <FormControlLabel key={option} value={option} label={option} control={
                                <Checkbox size={settings.inputSize}
                                          onChange={(e) => handleCheckboxSelect({target: {name: fieldName, value: option, checked: e.target.checked}})}
                                          slotProps={{
                                              root: {style: {height: '36px', width: '36px', marginRight: '4px'}}
                                          }}/>}
                            />)
                        }
                        {otherOptionField &&
                            <div style={{display: 'flex', height: 40}}>
                                <FormControlLabel key='Other' value='Other' label='Other' control={
                                    <Checkbox size={settings.inputSize}
                                              onChange={(e) => handleCheckboxSelect({target: {name: fieldName, value: 'Other', checked: e.target.checked}})}
                                              slotProps={{
                                                  root: {style: {height: '36px', width: '36px', marginRight: '4px'}}
                                              }}/>
                                }/>
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
                    </FormControl>
                </div>
            }

            {fieldType === 'StarRating' &&
                <div style={{margin: settings.margin}}>
                    {label &&
                        <Typography sx={{marginBottom: '2px', ...settings.labelStyle}}>{label}</Typography>
                    }
                    {description &&
                        <Typography sx={{marginBottom: '2px', ...settings.descriptionStyle}}>{description}</Typography>
                    }
                    <div style={{display: 'flex', placeItems: 'center', flexGrow: 0, margin: '6px 0px 0px 6px'}}>
                        <Typography sx={{fontSize: '0.9rem', textAlign: 'right'}}>{options[0]}</Typography>
                        <div style={{margin: '0px 16px'}}>
                            <RatingTable ratingDimensions={{[fieldName]: '_'}}
                                         onRatingChange={handleRatingChange}
                                         ratings={{[fieldName]: form.form[fieldName] || 0}}
                                         emptyColor={alpha(theme.palette.text.secondary, 0.2)}
                                         showLabel={false}
                                         fontSize={'0.9rem'} size={25} paddingData={0} iconsCount={5}/>
                        </div>
                        <Typography sx={{fontSize: '0.85rem'}}>{options[1]}</Typography>
                    </div>
                </div>
            }


        </>
    )
}