/*
 This file is part of Ext JS 3.4

 Copyright (c) 2011-2013 Sencha Inc

 Contact:  http://www.sencha.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://www.sencha.com/contact.

 Build date: 2013-04-03 15:07:25
 */
/**
 * Polish Translations
 * By rychlik 15-September-2017
 * Encoding: utf-8
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Wczytywanie danych...</div>';

if (Ext.data.Types) {
    Ext.data.Types.stripRe = /[\$,%]/g;
}

if (Ext.DataView) {
    Ext.DataView.prototype.emptyText = "";
}

if (Ext.grid.GridPanel) {
    Ext.grid.GridPanel.prototype.ddText = "{0} selected row{1}";
}

if (Ext.LoadMask) {
    Ext.LoadMask.prototype.msg = "Wczytywanie...";
}

Date.monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień"
];

Date.getShortMonthName = function (month) {
    return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
    Sty: 0,
    Lut: 1,
    Mar: 2,
    Kwi: 3,
    Maj: 4,
    Cze: 5,
    Lip: 6,
    Sie: 7,
    Wrz: 8,
    Paź: 9,
    Lis: 10,
    Gru: 11
};

Date.getMonthNumber = function (name) {
    return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota"
];

Date.getShortDayName = function (day) {
    return Date.dayNames[day].substring(0, 3);
};

Date.parseCodes.S.s = "(?:st|nd|rd|th)";

if (Ext.MessageBox) {
    Ext.MessageBox.buttonText = {
        ok: "OK",
        cancel: "Anuluj",
        yes: "Tak",
        no: "Nie"
    };
}

if (Ext.util.Format) {
    Ext.util.Format.date = function (v, format) {
        if (!v) return "";
        if (!(v instanceof Date)) v = new Date(Date.parse(v));
        return v.dateFormat(format || "d-m-Y");
    };
}

if (Ext.DatePicker) {
    Ext.apply(Ext.DatePicker.prototype, {
        todayText: "Dzisiaj",
        minText: "Data jest wcześniejsza od daty minimalnej",
        maxText: "Data jest późniejsza od daty maksymalnej",
        disabledDaysText: "",
        disabledDatesText: "",
        monthNames: Date.monthNames,
        dayNames: Date.dayNames,
        nextText: 'Następny miesiąc (Control+StrzałkaWPrawo)',
        prevText: 'Poprzedni miesiąc (Control+StrzałkaWLewo)',
        monthYearText: 'Wybierz miesiąc (Control+Up/Down aby zmienić rok)',
        todayTip: "{0} (Spacja)",
        format: "d-m-Y",
        okText: "&#160;OK&#160;",
        cancelText: "Anuluj",
        startDay: 0
    });
}

if (Ext.PagingToolbar) {
    Ext.apply(Ext.PagingToolbar.prototype, {
        beforePageText: "Strona",
        afterPageText: "z {0}",
        firstText: "Pierwsza strona",
        prevText: "Poprzednia strona",
        nextText: "Następna strona",
        lastText: "Ostatnia strona",
        refreshText: "Odśwież",
        displayMsg: "Wyświetlono {0} - {1} z {2}",
        emptyMsg: 'Brak danych do wyświetlenia'
    });
}

if (Ext.form.BasicForm) {
    Ext.form.BasicForm.prototype.waitTitle = "Proszę czekać..."
}

if (Ext.form.Field) {
    Ext.form.Field.prototype.invalidText = "Niedozwolona wartość w polu";
}

if (Ext.form.TextField) {
    Ext.apply(Ext.form.TextField.prototype, {
        minLengthText: "Minimalna wartość dla tego pola to {0}",
        maxLengthText: "Maksymalna wartość dla tego pola to {0}",
        blankText: "Pole jest wymagane",
        regexText: "",
        emptyText: null
    });
}

if (Ext.form.NumberField) {
    Ext.apply(Ext.form.NumberField.prototype, {
        decimalSeparator: ".",
        decimalPrecision: 2,
        minText: "Minimalna wartość dla tego pola to {0}",
        maxText: "Maksymalna wartość dla tego pola to {0}",
        nanText: "{0} nie jest właściwym numerem"
    });
}

if (Ext.form.DateField) {
    Ext.apply(Ext.form.DateField.prototype, {
        disabledDaysText: "Wyłączony",
        disabledDatesText: "Wyłączony",
        minText: "Data w tym polu musi być późniejsza od {0}",
        maxText: "Data w tym polu musi być wcześniejsza od {0}",
        invalidText: "{0} to nie jest prawidłowa data - prawidłowy format daty {1}",
        format: "d-m-Y",
        altFormats: "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
        startDay: 0
    });
}

if (Ext.form.ComboBox) {
    Ext.apply(Ext.form.ComboBox.prototype, {
        loadingText: "Wczytywanie...",
        valueNotFoundText: undefined
    });
}

if (Ext.form.VTypes) {
    Ext.apply(Ext.form.VTypes, {
        emailText: 'To pole wymaga podania adresu e-mail w formacie: "nazwa@domena.pl"',
        urlText: 'To pole wymaga podania adresu strony www w formacie:		"http:/' + '/www.domena.pl"',
        alphaText: 'To pole wymaga podania tylko liter i _',
        alphanumText: 'To pole wymaga podania tylko liter, cyfr i _'
    });
}

if (Ext.form.HtmlEditor) {
    Ext.apply(Ext.form.HtmlEditor.prototype, {
        createLinkText: 'Wprowadź adres URL strony:',
        buttonTips: {
            bold: {
                title: 'Pogrubienie (Ctrl+B)',
                text: 'Ustaw styl zaznaczonego tekstu na pogrubiony.',
                cls: 'x-html-editor-tip'
            },
            italic: {
                title: 'Kursywa (Ctrl+I)',
                text: 'Ustaw styl zaznaczonego tekstu na kursywę.',
                cls: 'x-html-editor-tip'
            },
            underline: {
                title: 'Podkreślenie (Ctrl+U)',
                text: 'Podkreśl zaznaczony tekst.',
                cls: 'x-html-editor-tip'
            },
            increasefontsize: {
                title: 'Zwiększ czcionkę',
                text: 'Zwiększ rozmiar czcionki.',
                cls: 'x-html-editor-tip'
            },
            decreasefontsize: {
                title: 'Zmniejsz czcionkę',
                text: 'Zmniejsz rozmiar czcionki.',
                cls: 'x-html-editor-tip'
            },
            backcolor: {
                title: 'Wyróżnienie',
                text: 'Zmień kolor wyróżnienia zaznaczonego tekstu.',
                cls: 'x-html-editor-tip'
            },
            forecolor: {
                title: 'Kolor czcionki',
                text: 'Zmień kolor zaznaczonego tekstu.',
                cls: 'x-html-editor-tip'
            },
            justifyleft: {
                title: 'Do lewej',
                text: 'Wyrównaj tekst do lewej.',
                cls: 'x-html-editor-tip'
            },
            justifycenter: {
                title: 'Wyśrodkuj',
                text: 'Wyrównaj tekst do środka.',
                cls: 'x-html-editor-tip'
            },
            justifyright: {
                title: 'Do prawej',
                text: 'Wyrównaj tekst do prawej.',
                cls: 'x-html-editor-tip'
            },
            insertunorderedlist: {
                title: 'Lista wypunktowana',
                text: 'Rozpocznij listę wypunktowaną.',
                cls: 'x-html-editor-tip'
            },
            insertorderedlist: {
                title: 'Lista numerowana',
                text: 'Rozpocznij listę numerowaną.',
                cls: 'x-html-editor-tip'
            },
            createlink: {
                title: 'Hiperłącze',
                text: 'Przekształć zaznaczony tekst w hiperłącze.',
                cls: 'x-html-editor-tip'
            },
            sourceedit: {
                title: 'Edycja źródła',
                text: 'Przełącz w tryb edycji źródła.',
                cls: 'x-html-editor-tip'
            }
        }
    });
}

if (Ext.grid.GridView) {
    Ext.apply(Ext.grid.GridView.prototype, {
        sortAscText: "Sortuj rosnąco",
        sortDescText: "Sortuj malejąco",
        columnsText: "Kolumny"
    });
}

if (Ext.grid.GroupingView) {
    Ext.apply(Ext.grid.GroupingView.prototype, {
        emptyGroupText: '(None)',
        groupByText: 'Grupuj po tym polu',
        showGroupsText: 'Pokaż w grupach'
    });
}

if (Ext.grid.PropertyColumnModel) {
    Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
        nameText: "Nazwa",
        valueText: "Wartość",
        dateFormat: "m/j/Y",
        trueText: "true",
        falseText: "false"
    });
}

if (Ext.grid.BooleanColumn) {
    Ext.apply(Ext.grid.BooleanColumn.prototype, {
        trueText: "true",
        falseText: "false",
        undefinedText: '&#160;'
    });
}

if (Ext.grid.NumberColumn) {
    Ext.apply(Ext.grid.NumberColumn.prototype, {
        format: '0,000.00'
    });
}

if (Ext.grid.DateColumn) {
    Ext.apply(Ext.grid.DateColumn.prototype, {
        format: 'm/d/Y'
    });
}

if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
        splitTip: "Przeciągnij aby zmienić rozmiar.",
        collapsibleSplitTip: "Przeciągnij aby zmienić rozmiar. Kliknij dwukrotnie aby ukryć."
    });
}

if (Ext.form.TimeField) {
    Ext.apply(Ext.form.TimeField.prototype, {
        minText: "Czas w typ polu musi być równy lub późniejszy niż {0}",
        maxText: "Czas w typ polu musi być równy lub wcześniejszy niż {0}",
        invalidText: "{0} nie jest prawidłowym czasem",
        format: "g:i A",
        altFormats: "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
    });
}

if (Ext.form.CheckboxGroup) {
    Ext.apply(Ext.form.CheckboxGroup.prototype, {
        blankText: "Musisz wybrać co najmniej 1 obiekt z grupy"
    });
}

if (Ext.form.RadioGroup) {
    Ext.apply(Ext.form.RadioGroup.prototype, {
        blankText: "Musisz wybrać dokładnie 1 obiekt z grupy"
    });
}
