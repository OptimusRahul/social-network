export const postData = (postBody:any) => {
    return { ...postBody };
}

export const reactionData = (previousReactions: any, newReaction:any) => {
    return {...previousReactions, newReaction}
}

export const commentData = (comment:any) => {
    return { ...comment };
}