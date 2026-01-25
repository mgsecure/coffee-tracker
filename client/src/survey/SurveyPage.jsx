import React, {useCallback, useContext, useMemo, useState} from 'react'
import FormElement from '../formUtils/FormElement.jsx'
import AuthContext from '../app/AuthContext.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

export default function SurveyPage() {
    const {isLoggedIn} = useContext(AuthContext)

    const baseForm = useMemo(() => {
        return {
            required: []
        }
    }, [])
    const [form, setForm] = useState(baseForm)
    const [formChanged, setFormChanged] = useState(false)
    const [updating, setUpdating] = useState(false)

    const saveEnabled = useMemo(() => {
        return isLoggedIn && (form.required.reduce((acc, field) => acc && form[field], true)) && !updating
    }, [form, isLoggedIn, updating])

    const handleFormChange = useCallback((event) => {
        const {name, value, action} = event.target
        if (action === 'delete') {
            setForm((prevForm) => {
                const newForm = {...prevForm}
                delete newForm[name]
                return newForm
            })
        } else setForm((prevForm) => ({...prevForm, [name]: value}))
        setFormChanged(true)
    }, [])

    console.log('render survey form', form)

    const {isMobile} = useWindowSize()

    return (
        <div style={{padding: isMobile ? '0px 12px' : '0px 20px'}}>
            <div style={{margin: '16px 0px 6px', fontSize: '1.6rem', fontWeight: 700}}>Record Keeping Survey</div>
            <div style={{margin: '0px 0px 36px', fontSize: '1.1rem', lineHeight: '1.5rem', fontWeight: 400}}>
                We’d love to hear your opinions about keeping track of your
                coffees, brews, and recipes. Here is a brief (approximately
                X minutes) survey to give your feedback. All questions are
                optional and the survey is entirely anonymous. Responses
                will be summarized and shared with the community.
            </div>


            <div style={{margin: '16px 0px 16px'}}>
                <span style={{fontSize: '1.5rem', fontWeight: 700}}>A Little About You</span>
                <span style={{fontSize: '1.0rem', fontWeight: 400, marginLeft:10}}>(Part 1 of 3)</span>
            </div>


            <FormElement fieldType={'RadioGroup'}
                         fieldName={'experienceLevel'}
                         description={'How would you characterize your experience level with coffee?'}
                         options={['Novice', 'Enthusiast', 'Well experienced', 'Expert', 'Guru']}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'RadioGroup'}
                         fieldName={'generallyShop'}
                         description={'Where do you generally get your coffee?'}
                         options={['Supermarket', 'Local roaster/coffee shop', 'National/international roaster', 'Home roasted']}
                         otherOptionField={'generallyShopOther'}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 200}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'RadioGroup'}
                         fieldName={'subscription'}
                         description={'Do you currently use a coffee subscription (or have used one in the past)?'}
                         options={['Yes', 'No']}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 200}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'RadioGroup'}
                         fieldName={'recordDetails'}
                         description={'Do you record details of your coffees and/or brew parameters?'}
                         options={['Yes', 'No']}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 200}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <div style={{margin: '24px 0px 16px'}}>
                <span style={{fontSize: '1.5rem', fontWeight: 700}}>Keeping Track</span>
                <span style={{fontSize: '1.0rem', fontWeight: 400, marginLeft:10}}>(Part 2 of 3)</span>
            </div>



            <FormElement fieldType={'RadioGroup'}
                         fieldName={'trackingMethod'}
                         description={'If so, what do you use?'}
                         options={['Paper notebook', 'Notes app', 'Dedicated coffee app', 'Website']}
                         otherOptionField={'trackingMethodOther'}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 220}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'StarRating'}
                         fieldName={'trackingSatisfaction'}
                         description={'How satisfied are you with that method of record keeping?'}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 220}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'TextField'}
                         fieldName={'favoriteFeatures'}
                         description={'What are your favorite aspects/features of it?'}
                         fieldSettings={{
                             descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                             margin: '0px 0px 16px 0px',
                             inputWidth: '100%'
                         }}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'TextField'}
                         fieldName={'needsImprovement'}
                         description={'What could be improved?'}
                         fieldSettings={{
                             descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                             margin: '0px 0px 16px 0px',
                             inputWidth: '100%'
                         }}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'TextField'}
                         fieldName={'featuresRequested'}
                         description={'Are there specific “features” you would like to have?'}
                         fieldSettings={{
                             descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                             margin: '0px 0px 16px 0px',
                             inputWidth: '100%'
                         }}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>

            <FormElement fieldType={'TextField'}
                         fieldName={'featuresRequested'}
                         description={'Any general thoughts or comments?'}
                         multiline={true}
                         rows={4}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: '100%'}}
                         form={form}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>


            <hr style={{margin: '24px 0px'}}/>

            <FormElement fieldType={'TextField'}
                         fieldName={'grindSetting'}
                         label={'Grind'}
                         form={form}
                         fieldSettings={{inputWidth: 180}}
                         formDefaults={formDefaults}
                         handleFormChange={handleFormChange}/>


        </div>
    )
}

const formDefaults = {
    margin: '0px 0px 32px 0px',
    labelStyle: {fontSize: '1.0rem', fontWeight: 700},
    descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
    inputWidth: 80,
    inputSize: 'small',
    color: 'info'
}
