import {useCallback, useState} from 'react'

export default function useForm({baseForm, handleSubmit}) {
    const [form, setForm] = useState(baseForm)
    const [intialized, setInitialized] = useState(false)
    const [required, setRequired] = useState([])
    const [changed, setChanged] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(undefined)

    const canSave =
        intialized
        && changed
        && (required.reduce((acc, field) => acc && form[field], true))
        && !submitting

    //console.log('form', form)

    const initialize = useCallback((params) => {
        setRequired(params.requiredFields)
        setInitialized(true)
    }, [])

    const require = useCallback((requiredFields) => {
        setRequired(requiredFields)
    }, [])

    const update = useCallback((event) => {
        const {name, value, action} = event.target
        if (action === 'delete') {
            setForm((prevForm) => {
                const newForm = {...prevForm}
                delete newForm[name]
                return newForm
            })
        } else setForm((prevForm) => ({...prevForm, [name]: value}))
        setChanged(true)
    }, [])

    const reload = useCallback(() => {
        setInitialized(false)
        setSubmitted(false)
        setChanged(false)
        setForm(baseForm)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }, 100)

    }, [baseForm])

    const submit = useCallback(async () => {
        setSubmitting(true)
        console.log('submitting', {form, required})

        try {
            await handleSubmit(form)
            setSubmitted(true)
        } catch (ex) {
            setError(ex)
            console.error('Error submitting form:', ex)
        }

        setSubmitting(false)
    }, [form, handleSubmit, required])

    return {
        initialize,
        intialized,
        form,
        require,
        update,
        changed,
        canSave,
        submit,
        submitting,
        submitted,
        reload,
        error
    }
}
