export class User {
    name: string
    email: string
    usertype: 'user'
    permissionMap: [
        { updateEstimateTime: boolean },
        { updateReleaseTag: boolean },
        { updateStoryPoint: boolean },
        { updateStatusBuild: boolean },
        { buildHistory: boolean }
    ]
    status: 'active'
    localId: ''
    authenticationToke:''
    baseUrl:''
}