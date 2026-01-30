// noinspection JSValidateTypes

import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import FormElement from '../formUtils/FormElement.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import {openInNewTab} from '../util/openInNewTab'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import LoadingDisplayWhiteSmall from '../misc/LoadingDisplayWhiteSmall.jsx'
import useForm from '../formUtils/useForm.jsx'
import DBContext from '../app/DBContext.jsx'
import Dialog from '@mui/material/Dialog'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import {Collapse} from '@mui/material'

export default function SurveyPage() {

    const {saveSurveySubmission} = useContext(DBContext)
    const [keepsTrack, setKeepsTrack] = useState(true)

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        if (name === 'userRecordsDetails') {
            if (value === 'Yes') {
                setKeepsTrack(true)
            } else {
                setKeepsTrack(false)
            }
            setKeepsTrack(value !== 'No')
        }
    }, [])

    const baseForm = useMemo(() => {
        return {}
    }, [])


    const processSubmit = useCallback((form) => {
        const notTrackFields = ['trackingNotReason', 'trackingNotReasonOther',
            'trackingNotSatisfaction', 'trackingNotFeaturesRequested', 'trackingNotGeneralComments']
        const trackFields = ['trackingMethod', 'trackingSatisfaction', 'trackingFavoriteFeatures',
            'trackingNeedsImprovement', 'trackingFeaturesRequested', 'trackingGeneralComments']
        const newForm = {...form}
        if (keepsTrack) {
            notTrackFields.forEach(field => delete newForm[field])
        } else {
            trackFields.forEach(field => delete newForm[field])
        }
        console.log('processing', newForm)
        return newForm
    }, [keepsTrack])

    const form = useForm({baseForm, processChange, processSubmit, handleSubmit: saveSurveySubmission})

    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: []
            })
        }
    }, [form])

    const {isMobile} = useWindowSize()

    return (
        <React.Fragment>
            <div style={{padding: isMobile ? '0px 12px' : '0px 20px'}}>
                <Typography variant='h4' sx={{margin: '16px 0px 6px', fontSize: '1.6rem', fontWeight: 700}}>Record
                    Keeping Survey</Typography>
                <Typography sx={{margin: '0px 0px 36px', fontSize: '1.1rem', lineHeight: '1.5rem', fontWeight: 400}}>
                    We’d love to hear your opinions about keeping track of your
                    coffees, brews, and recipes.
                    Here is a brief survey to give your feedback.
                    All questions are optional and the survey is entirely anonymous.
                    Responses will be summarized and shared with the community.
                </Typography>

                <FormElement fieldType={'SectionHeader'}
                             label={'A Little About You'}
                             options={[1, 3]}/>

                <FormElement fieldType={'RadioGroup'}
                             fieldName={'userExperienceLevel'}
                             description={'How would you characterize your experience level with coffee?'}
                             options={['Novice', 'Enthusiast', 'Well experienced', 'Expert', 'Guru']}
                             fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}}}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'RadioGroup'}
                             fieldName={'userGenerallyShop'}
                             description={'Where do you generally get your coffee?'}
                             options={['Supermarket', 'Local roaster/coffee shop', 'National/international roaster', 'Home roasted']}
                             otherOptionField={'userGenerallyShopOther'}
                             fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 200}}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'Checkboxes'}
                             fieldName={'userMethods'}
                             description={'Which brewing methods do you use regularly?'}
                             options={['Espresso', 'Pour Over', 'French Press', 'Drip', 'Stovetop']}
                             otherOptionField={'userMethodsOther'}
                             fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 200}}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'SelectBox'}
                             fieldName={'userCoffeesPerDay'}
                             description={'How many coffees do you generally make per day?'}
                             options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10 or more']}
                             fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 140}}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'RadioGroup'}
                             fieldName={'userRecordsDetails'}
                             description={'Do you record details of your coffees and/or brew parameters?'}
                             options={['Yes', 'No']}
                             fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 200}}
                             form={form}
                             formDefaults={formDefaults}/>


                <FormElement fieldType={'SectionHeader'}
                             label={'Keeping Track'}
                             options={[2, 3]}/>

                <Collapse in={keepsTrack}>
                    <FormElement fieldType={'RadioGroup'}
                                 fieldName={'trackingMethod'}
                                 description={'If you do keep records, what do you use?'}
                                 options={['Paper notebook', 'Notes app', 'Dedicated coffee app', 'Website']}
                                 otherOptionField={'trackingMethodOther'}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     inputWidth: 220
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'StarRating'}
                                 fieldName={'trackingSatisfaction'}
                                 description={'How satisfied are you with that method of record keeping?'}
                                 options={['Not Satisfied', 'Very Satisfied']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     inputWidth: 220
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'TextField'}
                                 fieldName={'trackingFavoriteFeatures'}
                                 description={'What are your favorite aspects/features of it?'}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     margin: '0px 0px 16px 0px',
                                     inputWidth: '100%'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'TextField'}
                                 fieldName={'trackingNeedsImprovement'}
                                 description={'What could be improved?'}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     margin: '0px 0px 16px 0px',
                                     inputWidth: '100%'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'TextField'}
                                 fieldName={'trackingFeaturesRequested'}
                                 description={'Are there specific “features” you would like to have?'}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     margin: '0px 0px 16px 0px',
                                     inputWidth: '100%'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'TextField'}
                                 fieldName={'trackingGeneralComments'}
                                 description={'Any general thoughts or comments?'}
                                 multiline={true}
                                 rows={4}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     inputWidth: '100%'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>
                </Collapse>

                <Collapse in={keepsTrack === false}>
                    <FormElement fieldType={'RadioGroup'}
                                 fieldName={'trackingNotReason'}
                                 description={'If you don\'t keep records, what\'s the main reason?'}
                                 options={['Paper notebook', 'Notes app', 'Dedicated coffee app', 'Website']}
                                 otherOptionField={'trackingNotReasonOther'}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     inputWidth: 220
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'StarRating'}
                                 fieldName={'trackingNotSatisfaction'}
                                 description={'How satisfied are you with not keeping records?'}
                                 options={['Not Satisfied', 'Very Satisfied']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     inputWidth: 220
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'TextField'}
                                 fieldName={'trackingNotFeaturesRequested'}
                                 description={'Is there anything an app or website could offer to make coffee easier or more enjoyable?'}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     margin: '0px 0px 16px 0px',
                                     inputWidth: '100%'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'TextField'}
                                 fieldName={'trackingNotGeneralComments'}
                                 description={'Any general thoughts or comments?'}
                                 multiline={true}
                                 rows={4}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     inputWidth: '100%'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>
                </Collapse>


                <FormElement fieldType={'SectionHeader'}
                             label={'A Little About Us'}
                             options={[3, 3]}/>

                <div style={{margin: '0px 0px 36px', fontSize: '1.1rem', lineHeight: '1.5rem', fontWeight: 400}}>
                    We’ve launched a free – and ad-free – site (<Link
                    onClick={() => openInNewTab('/')}>coffee-tracker.com</Link>)
                    to help the community record the details of their coffees/brews. We&apos;re
                    asking folks for concrete feedback (either positive or negative).
                    You don’t need to actually use the site if you don’t want to.
                    We’ve assembled <Link onClick={() => openInNewTab('/screenshots')}>screenshots</Link> or
                    you can use the site in “<Link onClick={() => openInNewTab('/coffees?demo=true')}>demo mode</Link>”,
                    with sample data already filled in.
                </div>

                <FormElement fieldType={'StarRating'}
                             fieldName={'siteRateOverall'}
                             description={'How would you rate the site overall?'}
                             options={['Bad', 'Very Good']}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                 inputWidth: 220
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'TextField'}
                             fieldName={'siteFavoriteFeatures'}
                             description={'What are your favorite aspects/features of it?'}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 margin: '0px 0px 16px 0px',
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'TextField'}
                             fieldName={'siteNeedsImprovement'}
                             description={'What could be improved?'}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 margin: '0px 0px 16px 0px',
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

                <div style={{margin: '30px 0px 16px', fontSize: '1.1rem', lineHeight: '1.5rem', fontWeight: 500}}>
                    Here are some additional features we are considering,
                    how would you rate your interest in them:
                </div>

                <div style={{marginLeft: 24}}>
                    <FormElement fieldType={'StarRating'}
                                 fieldName={'siteFeatureShareProfile'}
                                 description={'Share a snapshot of your coffee history with others.'}
                                 options={['Not Interested', 'Very Interested']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     margin: '0px 20px 24px 0px'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'StarRating'}
                                 fieldName={'siteFeatureShareData'}
                                 description={'Share data (anonymously) to build up a database of recipes/ratings across the community.'}
                                 options={['Not Interested', 'Very Interested']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     margin: '0px 20px 24px 0px'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'StarRating'}
                                 fieldName={'siteFeaturePhotoUploads'}
                                 description={'Upload photos of bags, labels, beans, etc.'}
                                 options={['Not Interested', 'Very Interested']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     margin: '0px 20px 24px 0px'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'StarRating'}
                                 fieldName={'siteFeatureResources'}
                                 description={'More resources about coffees, equipment, and roasters.'}
                                 options={['Not Interested', 'Very Interested']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     margin: '0px 20px 24px 0px'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <FormElement fieldType={'StarRating'}
                                 fieldName={'siteFeatureContent'}
                                 description={'Coffee content: community reviews, recommendations, YouTube channels, etc.'}
                                 options={['Not Interested', 'Very Interested']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500, marginBottom: 0},
                                     margin: '0px 20px 24px 0px'
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>
                </div>

                <FormElement fieldType={'TextField'}
                             fieldName={'siteFeaturesRequested'}
                             description={'Are there any other specific features you would like to have?'}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 margin: '0px 0px 16px 0px',
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'TextField'}
                             fieldName={'siteOverallComments'}
                             description={'Any overall thoughts or comments about the site?'}
                             multiline={true}
                             rows={4}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'TextField'}
                             fieldName={'userPlatformName'}
                             description={'Reddit or Discord username. Completely optional. It will never be published but we may use it to reach out for more detail about your responses.'}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 400},
                                 margin: '24px 0px 16px 0px',
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>


                <Typography sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '24px',
                    fontSize: '1.1rem',
                    fontWeight: 700
                }}>
                    Thank you for taking the time to share your perspective!
                </Typography>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 16}}>
                    <Button onClick={form.submit} variant='contained' color='info'
                            disabled={!form.canSave} style={{boxShadow: 'none'}}>
                        {form.updating
                            ? <LoadingDisplayWhiteSmall size={'small'}/>
                            : 'SUBMIT'
                        }
                    </Button>
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 16}}>
                <LogEntryButton entry={form.form} entryType={'Survey'} size={'small'}
                                style={{}}/>

            </div>

            <Dialog open={form.submitted} slotProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.8}}
            }}>
                <div style={{display: 'flex'}}>
                    <Paper sx={{marginLeft: 'auto', marginRight: 'auto', padding: '40px'}}>
                        <Typography sx={{
                            fontSize: '1.7rem',
                            fontWeight: 500,
                            marginBottom: '60px',
                            textAlign: 'center'
                        }}>Thank you for your feedback!
                        </Typography>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Button onClick={form.reload} variant='contained' color='success'
                                    style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                OK
                            </Button>
                        </div>
                    </Paper>
                </div>
            </Dialog>
        </React.Fragment>
    )
}

const formDefaults = {
    margin: '0px 0px 32px 0px',
    labelStyle: {fontSize: '1.0rem', fontWeight: 700},
    descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
    sectionHeaderStyle: {},
    sectionHeaderInfoStyle: {},
    inputWidth: 80,
    inputSize: 'small',
    color: 'info'
}
