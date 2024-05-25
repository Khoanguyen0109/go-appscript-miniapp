import supabase from "../client/client";

export const upsertUser = async (zaloUser) => {
  const { avatar, ...rest } = zaloUser;
  const { data } = await supabase
    .from("users")
    .select()
    .eq("idByOA", zaloUser.id);
  console.log("data", data);
  if (data?.length > 0) {
    return data[0];
  } else {
    const { data: newUser } = await supabase
      .from("users")
      .insert({ idByOA: zaloUser.id, name: zaloUser.name })
      .select();
    return newUser[0];
  }
};
