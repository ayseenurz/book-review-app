import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

const Details = ({
  author,
  detail,
}: {
  author: any;
  detail?: any;
}) => {
  const birthPlace = detail?.birth_place;
  const deathDate = detail?.death_date;
  const deathPlace = detail?.death_place;
  const subjects = Array.isArray(author.top_subjects)
    ? author.top_subjects.slice(0, 3).join(", ")
    : undefined;

  const formattedBirthDate = author.birth_date
    ? formatDateToTurkish(author.birth_date)
    : null;

  const formattedDeathDate = deathDate ? formatDateToTurkish(deathDate) : null;

  const summaryParts = [
    formattedBirthDate
      ? `${formattedBirthDate} tarihinde dünyaya gelmiştir.`
      : "",
    birthPlace
      ? `${birthPlace} kentinde doğmuş ve burada ilk yıllarını geçirmiştir.`
      : "",
    author.work_count
      ? `Yaşamı boyunca toplam ${author.work_count} eser kaleme alarak edebiyat dünyasına önemli katkılarda bulunmuştur.`
      : "",
    author.top_work
      ? `En çok tanınan eseri ise “${author.top_work}” olarak bilinmektedir.`
      : "",
    formattedDeathDate
      ? `${formattedDeathDate} tarihinde hayatını kaybetmiştir.`
      : "",
    deathPlace ? `Vefat ettiği yer: ${deathPlace}.` : "",
    subjects
      ? `Genellikle ${subjects} gibi konulara odaklanmış ve bu alanlarda eserler vermiştir.`
      : "",
  ];

  const summaryText = summaryParts.filter(Boolean).join(" ");

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.authorName}>{author.name}</Text>
      {summaryText ? (
        <Text style={styles.authorSummary}>{summaryText}</Text>
      ) : (
        <Text style={styles.authorSummary}>Yazar hakkında ayrıntılı bilgi bulunamadı.</Text>
      )}
    </View>
  );
};

function formatDateToTurkish(dateStr: string) {
  try {
    if (/^\d{4}$/.test(dateStr)) {
      return `${dateStr} yılı`;
    }
    const date = parseISO(dateStr);
    return format(date, "d MMMM yyyy", { locale: tr });
  } catch (e) {
    return dateStr;
  }
}

export default Details;

const styles = StyleSheet.create({
  detailsContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 12,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  authorName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6c584c",
    marginBottom: 20,
    textAlign: "left",
  },
  authorSummary: {
    fontSize: 18,
    color: "#666",
    textAlign: "left",
  },
});
