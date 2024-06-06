import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { categories } from '../data/categories'
import { Activity } from '../types'
import { ActivityActions, ActivityState } from '../reducers/activity-reducer'

type FormProps = {
    dispatch: Dispatch<ActivityActions>
    state: ActivityState
}

const initialState: Activity = {
    id: uuidv4(),
    category: 1,
    activities: '',
    calories: 0,
}

export default function Form({
    dispatch,
    state
}:FormProps){
    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(()=> {
        if(state.activeId){
           const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId)[0]
           setActivity(selectedActivity)
        }
    }, [state.activeId])

    const handleChange = (e: ChangeEvent<HTMLSelectElement|HTMLInputElement>) =>{
        const isNumberField = ['category', 'calories'].includes(e.target.id)

        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value: e.target.value
        })
    }

    const isValidActivity = () =>{
        const { activities, calories } = activity
        return activities.trim() !== '' && calories > 0
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        dispatch({type: 'save-activity', payload: {newActivity: activity}})
        setActivity({
            ...initialState,
            id: uuidv4()
        })
    }
    return(
        <form
            className="space-y-5 bg-white shadow p-10 rounded-lg"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className='font-bold'>Categoria:</label>
                <select name="category" id="category"
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    value={activity.category}
                    onChange={handleChange}
                >
                    {
                        categories.map((category)=>(
                            <option value={category.id} key={category.id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="activities" className='font-bold'>Actividad:</label>
                <input 
                    type="text" 
                    id='activities'
                    className='border border-slate-300 p-2 rounded-lg'
                    placeholder='Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas'
                    value={activity.activities}
                    onChange={handleChange}
                />
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className='font-bold'>Calorias:</label>
                <input 
                    type="number" 
                    id='calories'
                    className='border border-slate-300 p-2 rounded-lg'
                    placeholder='Ej. 300 o 500'
                    value={activity.calories}
                    onChange={handleChange}
                />
            </div>

            <input 
                type="submit" 
                className=' bg-gray-700 hover:bg-gray-900 focus:bg-white focus:text-black w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10'
                value={activity.category === 1? 'Guardar Comida' : 'Guardar Ejercicio'}
                disabled = {!isValidActivity()}
            />
        </form>
    )
}