import supabase from "./supabase";

export async function getContent(websiteId) {
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("website_id", websiteId)
    .order("display_order");

  if (error) throw new Error(error.message);
  return data;
}

// Function to update the website's text content
export async function updateTextContent({ id, value }) {
  const { data, error } = await supabase
    .from("content")
    .update({ value })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

// Function to update just the display width of an image row (currently
// used for the logo) — writes to the "width" column, separate from the
// "value" column that holds the image URL itself.
export async function updateContentWidth({ id, width }) {
  const { data, error } = await supabase
    .from("content")
    .update({ width })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

// Function to update the website's image content

export async function updateImageContent({ id, websiteId, key, file }) {
  const filePath = `${websiteId}/${key}`;

  // 1. delete the existing file first
  await supabase.storage.from("website-assets").remove([filePath]);

  // 2. upload the new file
  const { error: uploadError } = await supabase.storage
    .from("website-assets")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // 3. get the public URL
  const { data: urlData } = await supabase.storage
    .from("website-assets")
    .getPublicUrl(filePath);

  // 4. add a cache-busting timestamp to force the browser to reload the image
  const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  // 5. update the content table
  const { data, error } = await supabase
    .from("content")
    .update({ value: publicUrl })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateFileContent({ id, websiteId, key, file }) {
  const filePath = `${websiteId}/${key}`;

  // delete existing file first
  await supabase.storage.from("website-assets").remove([filePath]);

  // upload the new PDF
  const { error: uploadError } = await supabase.storage
    .from("website-assets")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // get public URL
  const { data: urlData } = supabase.storage
    .from("website-assets")
    .getPublicUrl(filePath);

  const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  // update content table
  const { data, error } = await supabase
    .from("content")
    .update({ value: publicUrl })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}
