const cargo_liberado_comandos_pontos = ["1132000406587838627"];
const canal_liberado_comandos_pontos = ["1082050174530109581"];
const id_autorizado_editar_pontos = ["975996926187175947"];




 
   const member = interaction.member;
    if (!member.roles.cache.some((role) => cargo_liberado_comandos_pontos.includes(role.id))) {
      return interaction.reply({
        content: " Você precisa ter o cargo **<@cargo_liberado_comandos_pontos>**",
        ephemeral: true,
      });
    }



    if (!canal_liberado_comandos_pontos.includes(interaction.channelId)) {
      return interaction.reply({
        content: "Este comando não pode ser executado neste canal, tente em **<#canal_liberado_comandos_pontos>**",
        ephemeral: true,
      });
    }
    

    if (!id_autorizado_editar_pontos.includes(interaction.user.id)) {
      return interaction.reply({
        content: " erro! função restrita somente para **<@id_autorizado_editar_pontos>**",
        ephemeral: true,
      });
    }

  