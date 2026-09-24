import { supabaseClient } from "./supabaseClient"

export async function uploadProductImage(imageFile: File) {
    const fileName = `${new Date().toISOString()}_${crypto.randomUUID()}_${imageFile.name}`
    const { data, error } = await supabaseClient.storage.from('products').upload(fileName, imageFile)
    if (error) throw error
    return data.path
}

export async function getProductImageUrl(imagePath: string) {
    const { data } = await supabaseClient.storage.from('products').getPublicUrl(imagePath)
    const imageUrl = data.publicUrl
    return imageUrl
}