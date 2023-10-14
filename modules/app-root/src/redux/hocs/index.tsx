/* eslint-disable @typescript-eslint/no-explicit-any, import/no-named-as-default-member */
import React, { Component, ComponentType } from 'react'
import { connect, ConnectedComponent } from 'react-redux'
import axios, { CancelTokenSource } from 'axios'
import { AppDispatch, LazyStatus } from '../type'
import { ActionMapDispatchToProps, ActionMapStateToProps, IReturnDispatch, TDispatchRedux, TStateRedux } from '../type'
import LazySpinner from './LazySpinner'

interface hocComponentProp<TActionParam> {
  params?: TActionParam
}

interface OptionsHocLazy<TActionParam> {
  params?: TActionParam
}
export const customConnect = function <
  TActionParam,
  TMapState extends TStateRedux,
  TMapDispatch extends TDispatchRedux<TActionParam> = TDispatchRedux<TActionParam>,
  TComponentProp = any
>(
  WrappedComponent: ComponentType<TComponentProp>,
  actionState: ActionMapStateToProps<TMapState> | null = null,
  actionProp: ActionMapDispatchToProps<TMapDispatch> | null = null,
  options: OptionsHocLazy<TActionParam> | null = null
) {
  type Props = hocComponentProp<TActionParam> & TMapState & TMapDispatch & TComponentProp
  class HocComponent extends Component<Props> {
    constructor(props: any) {
      super(props)
      this.state = {
        Status: LazyStatus.Loading
      }
    }

    componentDidMount = () => {
      const param = Object.assign({}, this.props.params ?? {}, options?.params ?? {})
      this.TokenSources = axios.CancelToken.source()
      this.DispatchReturn = this.props.FetchData ? this.props.FetchData(param, this.TokenSources.token) : undefined
    }

    TokenSources?: CancelTokenSource
    DispatchReturn?: IReturnDispatch
    componentWillUnmount() {
      this.TokenSources?.cancel('Cancel')
      this.DispatchReturn?.abort()
    }

    render = () => {
      return this.renderContent()
    }

    isFirst: boolean = true
    renderContent = () => {
      if (this.isFirst) {
        this.isFirst = false
        return <LazySpinner in />
      }
      switch (this.props.Status) {
        case LazyStatus.Loading:
        case LazyStatus.Loaded:
          return (
            <LazySpinner in={this.props.Status === LazyStatus.Loading}>
              <WrappedComponent {...this.props} />
            </LazySpinner>
          )
        case LazyStatus.Error:
          return <div>Error...</div>
        default:
          return <div></div>
      }
    }
  }

  const customActionProps = (dispatch: AppDispatch) => {
    return { ...(actionProp ? actionProp(dispatch) : {}) }
  }

  return connect(actionState, customActionProps)(HocComponent as any) as ConnectedComponent<
    ComponentType<TComponentProp>,
    TComponentProp
  >
}
