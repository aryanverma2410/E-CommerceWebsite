import {
	PACKAGING_LIST_REQUEST,
	PACKAGING_LIST_SUCCESS,
	PACKAGING_LIST_FAIL,
	PACKAGING_DETAILS_REQUEST,
	PACKAGING_DETAILS_SUCCESS,
	PACKAGING_DETAILS_FAIL,
	PACKAGING_DELETE_REQUEST,
	PACKAGING_DELETE_FAIL,
	PACKAGING_DELETE_SUCCESS,
	PACKAGING_CREATE_SUCCESS,
	PACKAGING_CREATE_FAIL,
	PACKAGING_CREATE_REQUEST,
	PACKAGING_UPDATE_REQUEST,
	PACKAGING_UPDATE_SUCCESS,
	PACKAGING_UPDATE_FAIL,
	PACKAGING_CREATE_RESET,
	PACKAGING_UPDATE_RESET,
} from '../constants/packagingConstants.js'

export const packagingListReducer = (state = { packagings: [] }, action) => {
	switch (action.type) {
		case PACKAGING_LIST_REQUEST:
			return { loading: true, packagings: [] }
		case PACKAGING_LIST_SUCCESS:
			return {
				loading: false,
				packagings: action.payload.packagings,
				pages: action.payload.pages,
				page: action.payload.page,
			}
		case PACKAGING_LIST_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const packagingDetailsReducer = (state = { packaging: [] }, action) => {
	switch (action.type) {
		case PACKAGING_DETAILS_REQUEST:
			return { ...state, loading: true }
		case PACKAGING_DETAILS_SUCCESS:
			return { loading: false, packaging: action.payload }
		case PACKAGING_DETAILS_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const packagingDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case PACKAGING_DELETE_REQUEST:
			return { loading: true }
		case PACKAGING_DELETE_SUCCESS:
			return { loading: false, success: true }
		case PACKAGING_DELETE_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const packagingCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case PACKAGING_CREATE_REQUEST:
			return { loading: true }
		case PACKAGING_CREATE_SUCCESS:
			return { loading: false, success: true, packaging: action.payload }
		case PACKAGING_CREATE_FAIL:
			return { loading: false, error: action.payload }
		case PACKAGING_CREATE_RESET:
			return {}
		default:
			return state
	}
}

export const packagingUpdateReducer = (state = { packaging: {} }, action) => {
	switch (action.type) {
		case PACKAGING_UPDATE_REQUEST:
			return { loading: true }
		case PACKAGING_UPDATE_SUCCESS:
			return { loading: false, success: true, packaging: action.payload }
		case PACKAGING_UPDATE_FAIL:
			return { loading: false, error: action.payload }
		case PACKAGING_UPDATE_RESET:
			return { packaging: {} }
		default:
			return state
	}
}
