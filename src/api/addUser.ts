import supabase from "../client/client";

export const upsertUser = async (user) => {
  //   const { data } = await supabase.from("users").select().eq("userId", user.id);
  //   if (data?.length > 0) {
  //     return data[0];
  //   }else{
  //     const { data } = await supabase.from("users").insert({
  //         id: user.id,
  //         idByOA: user.idByOA,
  //         phone: user.phone,
  //     })
  //   }
  const { avatar, ...rest } = user;
  const { data, error } = await supabase
    .from("users")
    .upsert({ id: user.id, name: user.name, ...rest })
    .select();

  return data;
};
