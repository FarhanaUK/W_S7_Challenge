import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.


const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.

const formSchema = yup.object().shape({
  fullName: yup
.string().trim()
.min(3, validationErrors.fullNameTooShort)
.max(20, validationErrors.fullNameTooLong)
.required('Full name is required'),
size: yup
  .string()
  .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
  .required('Size is required'),

})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialValue = () => (
  {fullName: "", favLanguage: "", toppings: []}
)

const initialValueErr = () => (
  {fullName: "", favLanguage: ""}
)
export default function Form() {

  const [values, setValues] = useState(initialValue())
  const [error, setError] = useState(initialValueErr())
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {


    formSchema.isValid(values)
    .then(valid => {
      setEnabled(valid)
    })
  
  },[values])
  
  
  
    const onChange = evt => {
      let {type, checked, name, value} = evt.target
      if(type === "checkbox") value = checked
  
      setValues({...values, [name]: value})


      yup.reach(formSchema, name).validate(value)
      .then(() => {
        setError({ ...error, [name]: "" }); 
      })
      .catch(err => {
        setError({ ...error, [name]: err.errors[0] }); 
      });
    }
  
    const onSubmit = evt => {
      evt.preventDefault()
      
  axios.post(`http://localhost:9009/api/order`, values)
  .then(res=> {
  setSuccess(res.data.message)
  setFailure()
  setValues(initialValue)
   })
  .catch(err => {
  setSuccess()
  setFailure(err.response.data.message)
  
  })
  
  
    }
  
  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" name="fullName" type="text" onChange={onChange} value={values.fullName} />
        </div>
        {error.fullName && <div className='error'>{error.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" onChange={onChange} value={values.size}>
            <option value="">Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            
            
            {/* Fill out the missing options */}
          </select>
        </div>
        {error.size && <div className='error'>{error.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label>
        <label key="2">
          <input
            name="Green Peppers"
            type="checkbox"
          />
          Green Peppers<br />
        </label>
        <label key="3">
          <input
            name="Pineapple"
            type="checkbox"
          />
          Pineapple<br />
        </label>
        <label key="4">
          <input
            name="Mushrooms"
            type="checkbox"
          />
          Mushrooms<br />
        </label>
        <label key="5">
          <input
            name="Ham"
            type="checkbox"
          />
          Ham<br />
        </label>
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled}/>
    </form>
  )
}
