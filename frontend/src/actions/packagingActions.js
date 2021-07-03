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
} from '../constants/packagingConstants.js'
import axios from 'axios'
import { logout } from './userActions'

export const listPackagings =
	(keyword = '', pageNumber = '') =>
	async (dispatch) => {
		try {
			dispatch({ type: PACKAGING_LIST_REQUEST })
			const { data } = await axios.get(
				`/api/packagings?keyword=${keyword}&pageNumber=${pageNumber}`
			)

			dispatch({
				type: PACKAGING_LIST_SUCCESS,
				payload: data,
			})
		} catch (error) {
			dispatch({
				type: PACKAGING_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			})
		}
	}

export const listPackagingDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: PACKAGING_DETAILS_REQUEST })
		const { data } = await axios.get(`/api/packagings/${id}`)

		dispatch({
			type: PACKAGING_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PACKAGING_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const deletePackaging = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PACKAGING_DELETE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		await axios.delete(`/api/packagings/${id}`, config)

		dispatch({
			type: PACKAGING_DELETE_SUCCESS,
		})
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logout())
		}
		dispatch({
			type: PACKAGING_DELETE_FAIL,
			payload: message,
		})
	}
}

export const createPackaging = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: PACKAGING_CREATE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.post(`/api/packagings `, {}, config)

		dispatch({
			type: PACKAGING_CREATE_SUCCESS,
			payload: data,
		})
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logout())
		}
		dispatch({
			type: PACKAGING_CREATE_FAIL,
			payload: message,
		})
	}
}

export const updatePackaging = (packaging) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PACKAGING_UPDATE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.put(
			`/api/packagings/${packaging._id} `,
			packaging,
			config
		)

		dispatch({
			type: PACKAGING_UPDATE_SUCCESS,
			payload: data,
		})
		dispatch({ type: PACKAGING_DETAILS_SUCCESS, payload: data })
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logout())
		}
		dispatch({
			type: PACKAGING_UPDATE_FAIL,
			payload: message,
		})
	}
}
