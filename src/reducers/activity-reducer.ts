import { Activity } from "../types"

export type ActivityActions = 
{ type: 'save-activity', payload: {newActivity: Activity } } |
{ type: 'setActiveId', payload: {id: Activity['id'] } } |
{ type: 'delete-activity', payload: {id: Activity['id'] } } |
{ type: 'restart-app' }


export type ActivityState = {
    activities : Activity[]
    activeId: Activity['id']
}

const localStorageActivities = (): Activity[] => {
    const activities = localStorage.getItem('activities');
    return activities ? JSON.parse(activities) : []
}

export const initialState: ActivityState = {
    activities: localStorageActivities(),
    activeId: ''
}

export const activityReducer = (
    state: ActivityState,
    action: ActivityActions
) => {

    if(action.type === 'save-activity'){
        const findActivity = state.activities.find((act)=> act.id === state.activeId)
        if(findActivity === undefined) {
            return {
                ...state,
                activities: [...state.activities, action.payload.newActivity]
            }
        }else {
            const newActivities = state.activities.map((act)=>{
                if(act.id === findActivity.id) {
                    return action.payload.newActivity
                }
                return act
            })

            return {
                ...state,
                activities: [...newActivities],
                activeId: ''
            }
        }
    }

    if (action.type === 'setActiveId') {
        return {
            ...state,
            activeId: action.payload.id
        }
    }

    if (action.type === 'delete-activity') {
        return {
            ...state,
            activities: state.activities.filter( activity => activity.id !== action.payload.id)
        }
    }

    if(action.type === 'restart-app') {
        return {
            activities: [],
            activeId: ''
        }
    }
    return state
}
