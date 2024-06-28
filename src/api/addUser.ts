import supabase from "../client/client";

export const upsertUser = async (zaloUser) => {
  const { avatar, ...rest } = zaloUser;
  const { data } = await supabase
    .from("users")
    .select()
    .eq("idByOA", zaloUser.id);
  if (data && data?.length > 0) {
    const user = data[0];
    if (!user.idUserToNotification && zaloUser.idByOA) {
      await supabase
        .from("users")
        .update({ idUserToNotification: zaloUser.idByOA })
        .eq("id", user.id);
    }
    return { ...data[0], avatar };
  } else {
    const { data: newUser } = await supabase
      .from("users")
      .insert({
        idByOA: zaloUser.id,
        name: zaloUser.name,
        avatar: zaloUser.avatar,
      })
      .select();
    if (newUser) {
      return { ...newUser[0], avatar };
    }
  }
};
