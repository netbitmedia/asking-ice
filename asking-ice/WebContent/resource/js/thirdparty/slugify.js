jQuery.slugify = function(txt) {
	if (txt == undefined) return txt;
	txt = removeAccents(txt.toLowerCase());
	txt = txt.replace(/\s+/g,'-');
	txt = txt.replace(/[^a-zA-Z0-9\-]/g,'').trim('-');
	return txt;
}

function removeAccents(str){
	//remove accented, perhaps there are other simple ways
    str = str.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
    str = str.replace(/[íìỉĩị]/g, 'i');
    str = str.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
    str = str.replace(/[úùủũụưứừửữự]/g, 'u');
    str = str.replace(/[ýỳỷỹỵ]/g, 'y');
    return str;
}