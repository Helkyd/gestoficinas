// Copyright (c) 2016, Helio de Jesus and contributors
// For license information, please see license.txt

var ordem
ordens= cur_frm.call({method:"get_avarias_clientes",args:{"Parent":""}})

frappe.ui.form.on('Folha de Obras', {
	onload: function(frm) {
	

	}
		
});

frappe.ui.form.on('Folha de Obras', {
	refresh: function(frm) {

		cur_frm.toggle_enable("data_abertura",false)
		cur_frm.toggle_enable("fo_operador",false)
		cur_frm.toggle_enable("data_entrada_or",false)
		cur_frm.toggle_enable("data_previsao_saida",false)
		cur_frm.toggle_enable("obs_cliente",false)


	}
});

frappe.ui.form.on('Folha de Obras','ordem_reparacao',function(frm,cdt,cdn){

	frappe.model.set_value(cdt,cdn,'fo_operador',frappe.session.user)

	if (cur_frm.doc.ordem_reparacao){
		reparar_('Ordem de Reparacao',cur_frm.doc.ordem_reparacao)

//		cur_frm.add_fetch("ordem_reparacao","avcliente_descricao","avarias_cliente")
//		pedidocliente_('Avarias_Cliente',cur_frm.doc.ordem_reparacao)
		cur_frm.doc.avarias_cliente =""
		if (ordens != undefined){
			for (var x = 0; x < ordens.responseJSON.message.length;x++){
				if (ordens.responseJSON.message[x].Parent == cur_frm.doc.ordem_reparacao){
					if (cur_frm.doc.avarias_cliente == undefined || cur_frm.doc.avarias_cliente == ""){
						cur_frm.doc.avarias_cliente = ordens.responseJSON.message[x].avcliente_descricao + '\n'
					}else{
						cur_frm.doc.avarias_cliente = ordens.responseJSON.message[x].avcliente_descricao + '\n' + cur_frm.doc.avarias_cliente
					}
				}
			}

		}

		//Enters Avarias reported by client to serve as Tasks

//		cur_frm.add_fetch("ordem_reparacao","avarias_cliente","avcliente_descricao")

//		cur_frm.fields_dict['avarias_cliente'].grid.get_field('avcliente_descricao').set_query = function(doc, cdt, cdn) {
//			return {
//				filters:[
//					['Avarias_Cliente', 'parent', '=', cur_frm.doc.ordem_reparacao]
//					['parent', '=', cur_frm.doc.ordem_reparacao]
//				]
//			}
//		}

//		grid_row = cur_frm.fields_dict['avarias_cliente'].grid.grid_rows_by_docname[child.name],
//		grid_row = cur_frm.fields_dict['avarias_cliente'].grid.get_field('avcliente_descricao'),
//		field = frappe.utils.filter_dict(grid_row.docfields, {fieldname: "avcliente_descricao"})[0];

//		grid_row.refresh_field("avarias_cliente");


//		cur_frm.fields_dict['avarias_cliente'].grid.get_field('avcliente_descricao').set_query = function(doc, cdt, cdn) {
//		cur_frm.set_query("avcliente_descricao", "avarias_cliente", function (frm) {
//			return {
//			    query: "gestoficinas.gestoficinas.doctype.api.get_avaria_cliente",
//			    filters: {'parent': cur_frm.doc.ordem_reparacao}
//			}
//		});

		cur_frm.refresh_fields('avarias_cliente');

		cur_frm.refresh_fields('nome_cliente');
	}


});


frappe.ui.form.on('Folha de Obras','fo_status',function(frm,cdt,cdn){
	//When changed to EM CURSO ... copies the info to Project and create the tasks.
	if (cur_frm.doc.fo_status == 'Em Curso'){
		alert("As Avarias do Cliente serao criadas e incluidas como um Projecto!!!\nDevera a folha depois ser enviar ou assignada ao Chefe de Oficina ou Area da Oficina para dar seguimento")
	}


});

frappe.ui.form.on("Avarias_Cliente","avarias_cliente",function(frm,cdt,cdn){



		cur_frm.refresh_fields('avarias_cliente');


});






var reparar_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm, cdt, function() { 
		var ordem = frappe.model.get_doc(frm,cdt)
		if (ordem){

			cur_frm.doc.nome_cliente = ordem.or_nome_cliente
			cur_frm.doc.cliente_telefone = ordem.or_client_number
			cur_frm.doc.email_cliente = ordem.or_email_cliente

			cur_frm.doc.marca_veiculo = ordem.or_marca_veiculo
			cur_frm.doc.matricula_veiculo = ordem.or_matricula
			cur_frm.doc.numero_chassi = ordem.or_numero_chassi

			cur_frm.doc.kms_entrada = ordem.or_kms_entrada
			cur_frm.doc.data_entrada_or = ordem.or_date
			cur_frm.doc.data_previsao_saida = ordem.or_previsao_entrega

			cur_frm.doc.obs_cliente = ordem.or_obs_cliente


		}
		
		cur_frm.refresh_fields();

	});


}


var pedidocliente_ = function(frm,cdt,cdn){
	frappe.model.with_doc(frm,cdt,function(){

//		var ordem = frappe.get_all(frm,filters={'Parent':cdt},fields=['Parent','avcliente_descricao'])
//		var ordem  = cur_frm.call({method:"get_avaria_cliente",args:{"frm":frm}})

		frappe.call({
			method: "gestoficinas.gestoficinas.doctype.api.get_avaria_cliente",
			args: {
				"cdt":cdt				
			},
			callback: function(r) {
//				var caix = frappe.model.sync(r.message);
//				msgprint(r.message)
				if (r.message !=undefined){
//					alert("Aberto ou em Curso")
					ordem = r.message
//					return
				}else{
					alert("CAIXA Fechado")
					
				}

			}
		});
	
//		if (ordem !=undefined){

//			for (var x = 0; x < ordem.length;x++){
//				cur_frm.doc.avarias_cliente = ordem[x].avcliente_descricao + ';' + cur_frm.doc.avarias_cliente
//			}


//		}
		
		cur_frm.refresh_fields();

	});

}
